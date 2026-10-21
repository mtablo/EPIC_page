# EPIC project website

Project website for **EPIC: Efficient Predicate-Guided Inference-Time Control for Compositional Text-to-Image Generation**, accepted at **NeurIPS 2026**.

**Sunung Mun, Sunghyun Cho, and Jungseul Ok** · POSTECH

- [Project page](https://mtablo.github.io/EPIC_page/)
- [Paper](https://arxiv.org/abs/2605.11722)

This repository contains the static website, including experimental examples, quantitative results, and the method overview. It requires no build step or external dependencies.

## Local preview

Run the following command from this directory, then open `http://localhost:8000`:

```sh
python3 -m http.server 8000
```

## GitHub Pages

In **Settings > Pages**, select **Deploy from a branch**, then choose **main** and **/ (root)**. The site URL is `https://mtablo.github.io/EPIC_page/`.

Image, script, and stylesheet paths are relative. The canonical URL and social preview image URL are configured in `index.html`.

## Editing

| Content | File |
| --- | --- |
| Paper information, authors, affiliations, text, and BibTeX | `index.html` |
| Layout and responsive styles | `assets/styles.css` |
| Results, atomicity scores, examples, and code URL | `assets/data.js` |
| Charts, example navigation, image viewer, and citation copying | `assets/main.js` |
| Experimental images | `assets/examples/` |
| Original image paths and source hashes | `assets/asset_manifest.json` |

When the implementation is released, set `codeUrl` in `assets/data.js` to its repository URL. This activates the Code link and removes the Coming soon label.

The website includes ten matched examples across five methods. Images retain the original composition and resolution and are converted to WebP for delivery. The asset manifest records their provenance. Atomicity results match the revised Figure 3a; all alignment scores use the Soft-TIFA GM/AM scale of 0-100.
