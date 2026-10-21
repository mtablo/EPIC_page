(() => {
  'use strict';
  const data = window.EPIC_DATA;
  if (!data) return;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const imagePath = (example, method) => `assets/examples/${example.id}/${method.id}.webp`;
  const methodName = (example, method) => example.methodNames?.[method.id] ?? method.name;
  let exampleIndex = 0;
  let lightboxMethodIndex = 4;
  const dialog = $('#image-lightbox');
  const grid = $('#comparison-grid');

  function setExample(index) {
    exampleIndex = (index + data.examples.length) % data.examples.length;
    const example = data.examples[exampleIndex];
    $('#example-select').value = example.id;
    $('#example-prompt').textContent = `“${example.prompt}”`;
    $('#example-count').textContent = `${exampleIndex + 1} / ${data.examples.length}`;
    data.methods.forEach(method => {
      const name = methodName(example, method);
      const trigger = grid.querySelector(`[data-method="${method.id}"]`);
      const img = trigger.querySelector('img');
      img.src = imagePath(example, method);
      img.alt = `${name} result for: ${example.prompt}`;
      trigger.setAttribute('aria-label', `Enlarge ${name} result: ${example.prompt}`);
      if (method.id !== 'epic') trigger.closest('figure').querySelector('figcaption').textContent = name;
    });
  }
  $('#example-select').addEventListener('change', event => {
    const index = data.examples.findIndex(example => example.id === event.target.value);
    if (index >= 0) setExample(index);
  });
  $('#example-prev').addEventListener('click', () => setExample(exampleIndex - 1));
  $('#example-next').addEventListener('click', () => setExample(exampleIndex + 1));

  function updateLightbox(index) {
    lightboxMethodIndex = (index + data.methods.length) % data.methods.length;
    const method = data.methods[lightboxMethodIndex];
    const example = data.examples[exampleIndex];
    const name = methodName(example, method);
    const img = $('#lightbox-image');
    img.src = imagePath(example, method);
    img.alt = `${name} result for: ${example.prompt}`;
    $('#lightbox-title').textContent = name + (method.id === 'epic' ? ' · Ours' : '');
    $('#lightbox-prompt').textContent = `“${example.prompt}”`;
    $('#lightbox-count').textContent = `${lightboxMethodIndex + 1} / ${data.methods.length}`;
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('.image-trigger');
    if (!trigger) return;
    if (trigger.dataset.example) {
      const index = data.examples.findIndex(example => example.id === trigger.dataset.example);
      if (index < 0) return;
      setExample(index);
    }
    const methodIndex = data.methods.findIndex(method => method.id === trigger.dataset.method);
    if (methodIndex < 0) return;
    updateLightbox(methodIndex);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('modal-open');
  });
  $('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  $('#lightbox-prev').addEventListener('click', () => updateLightbox(lightboxMethodIndex - 1));
  $('#lightbox-next').addEventListener('click', () => updateLightbox(lightboxMethodIndex + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      updateLightbox(lightboxMethodIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  const metrics = {
    gm: { title: 'Prompt-level alignment', description: 'Soft-TIFA GM (0–100). Higher is better.', format: value => value.toFixed(2) },
    executions: { title: 'Realized image-model executions', description: 'Generator and editor calls per prompt. Lower is better.', format: value => Number(value.toFixed(2)).toString() },
    tokens: { title: 'MLLM token usage', description: 'Input + output tokens per prompt, in thousands. Lower is better; “—” means unreported.', format: value => `${value.toFixed(1)}k` }
  };
  $$('[data-metric]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.metric;
    const metric = metrics[key];
    const max = key === 'gm' ? 100 : Math.max(...data.methods.map(method => method[key] ?? 0));
    $('#chart-title').textContent = metric.title;
    $('#chart-description').textContent = metric.description;
    $('#chart-max').textContent = key === 'tokens' ? `${max}k` : String(max);
    $$('[data-metric]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const chart = $('#result-chart');
    [...chart.children].forEach((row, index) => {
      const value = data.methods[index][key];
      row.querySelector('.bar').style.setProperty('--bar-width', `${value === null ? 0 : value / max * 100}%`);
      row.querySelector('.bar-value').textContent = value === null ? '—' : metric.format(value);
    });
    chart.setAttribute('aria-label', `${metric.title}. ${metric.description} ${data.methods.map(method => `${method.name}: ${method[key] === null ? 'unreported' : metric.format(method[key])}`).join('; ')}.`);
  }));

  const atomicity = data.atomicity;
  if (atomicity?.levels?.length && data.methods.every(method =>
    atomicity.scores?.[method.id]?.length === atomicity.levels.length &&
    atomicity.scores[method.id].every(score => Number.isFinite(score) && score >= 0 && score <= 100))) {
    const panel = $('#atomicity-results');
    const chart = $('#atomicity-chart');
    const colors = ['#8492a3', '#7a9557', '#bd8543', '#8a6ca8', '#3166cf'];
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgNode = (tag, attributes = {}, text) => {
      const element = document.createElementNS(svgNS, tag);
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      if (text !== undefined) element.textContent = text;
      return element;
    };
    panel.hidden = false;
    data.methods.forEach((method, index) => {
      const label = document.createElement('span');
      label.style.setProperty('--series-color', colors[index]);
      label.textContent = method.name;
      if (method.id === 'epic') label.className = 'atomicity-ours';
      $('#atomicity-legend').append(label);
    });
    $('#atomicity-source').textContent = atomicity.source || 'Paper';

    function drawAtomicity() {
      if (!panel.open || !chart.clientWidth) return;
      const width = chart.clientWidth;
      const height = width < 500 ? 290 : 320;
      const left = 38, right = 16, top = 32, bottom = 42;
      const x = index => left + index / (atomicity.levels.length - 1) * (width - left - right);
      const y = score => top + (100 - score) / 100 * (height - top - bottom);
      const svg = svgNode('svg', { viewBox: `0 0 ${width} ${height}`, width, height, role: 'img', 'aria-label': 'GenEval2 Soft-TIFA GM by prompt atomicity, comparing EPIC with four baselines.' });
      svg.append(svgNode('desc', {}, data.methods.map(method => `${method.name}: ${atomicity.levels.map((level, index) => `atomicity ${level}, ${atomicity.scores[method.id][index].toFixed(2)}`).join('; ')}`).join('. ')));
      svg.append(svgNode('text', { x: left, y: 16, fill: '#647184', 'font-size': 13 }, 'Soft-TIFA GM ↑'));
      [0, 25, 50, 75, 100].forEach(score => {
        svg.append(svgNode('line', { x1: left, y1: y(score), x2: width - right, y2: y(score), stroke: '#e5e8ed' }));
        svg.append(svgNode('text', { x: left - 9, y: y(score) + 4, 'text-anchor': 'end', fill: '#697587', 'font-size': 13 }, score));
      });
      atomicity.levels.forEach((level, index) => {
        svg.append(svgNode('text', { x: x(index), y: height - bottom + 22, 'text-anchor': 'middle', fill: '#697587', 'font-size': 14 }, level));
      });
      svg.append(svgNode('text', { x: (left + width - right) / 2, y: height - 2, 'text-anchor': 'middle', fill: '#647184', 'font-size': 13 }, 'Prompt atomicity'));
      data.methods.forEach((method, index) => {
        const scores = atomicity.scores[method.id];
        svg.append(svgNode('polyline', { points: scores.map((score, i) => `${x(i)},${y(score)}`).join(' '), fill: 'none', stroke: colors[index], 'stroke-width': method.id === 'epic' ? 3.3 : 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
        scores.forEach((score, i) => {
          const point = svgNode('circle', { cx: x(i), cy: y(score), r: method.id === 'epic' ? 3.8 : 3, fill: colors[index], stroke: '#fff', 'stroke-width': 1.4 });
          point.append(svgNode('title', {}, `${method.name}, atomicity ${atomicity.levels[i]}: ${score.toFixed(2)}`));
          svg.append(point);
        });
      });
      chart.replaceChildren(svg);
    }
    panel.addEventListener('toggle', drawAtomicity);
    if ('ResizeObserver' in window) new ResizeObserver(drawAtomicity).observe(chart);
    else window.addEventListener('resize', drawAtomicity);
  }

  $('#copy-bibtex').addEventListener('click', async () => {
    const text = $('#bibtex').textContent;
    const status = $('#copy-status');
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch (_) { /* Use the selection-based fallback below. */ }
    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.append(textarea);
      textarea.select();
      try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
      textarea.remove();
    }
    if (copied) {
      status.textContent = 'BibTeX copied to clipboard.';
      $('#copy-bibtex').textContent = 'Copied ✓';
      window.setTimeout(() => { $('#copy-bibtex').textContent = 'Copy BibTeX ⧉'; }, 2200);
    } else {
      const range = document.createRange();
      range.selectNodeContents($('#bibtex'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Citation selected. Use your keyboard’s copy shortcut.';
    }
  });

  if (data.codeUrl) {
    $$('[data-code-link]').forEach(link => {
      link.href = data.codeUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
    });
    $$('[data-code-status]').forEach(badge => { badge.hidden = true; });
  }

  if ('IntersectionObserver' in window) {
    const links = $$('.nav-links a[href^="#"]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
  }
})();
