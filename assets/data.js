/* Main-result values: tables/geneval2/geneval2_main.tex. Missing values stay null. */
window.EPIC_DATA = {
  codeUrl: null, // Replace with the public repository URL when ready.
  // Baselines: tables/geneval2/geneval2_atomicity.tex.
  // EPIC: author-confirmed appendix row in geneval2_ablation_atomicity.tex.
  // This row averages to 71.46 and matches the revised Figure 3a.
  atomicity: {
    levels: [3, 4, 5, 6, 7, 8, 9, 10],
    source: 'Paper: GenEval2 atomicity results',
    scores: {
      flux: [63.17, 55.11, 38.78, 34.27, 23.22, 21.66, 19.90, 17.19],
      bon: [75.72, 64.70, 52.05, 44.12, 28.06, 28.03, 23.64, 16.49],
      copilot: [64.33, 59.15, 45.68, 44.42, 25.35, 19.37, 19.53, 14.64],
      raise: [82.52, 74.92, 59.92, 55.62, 41.84, 42.16, 32.49, 28.37],
      epic: [89.24, 89.69, 78.59, 74.60, 71.19, 62.04, 57.96, 48.39]
    }
  },
  methods: [
    { id: 'flux', name: 'FLUX.2-Klein-9B', gm: 34.16, am: 79.06, executions: 1.0, calls: null, tokens: null },
    { id: 'bon', name: 'BoN+NVILA', gm: 41.60, am: 82.38, executions: 32.0, calls: null, tokens: null },
    { id: 'copilot', name: 'T2I-Copilot', gm: 36.56, am: 81.19, executions: 1.24, calls: 4.48, tokens: 15.2 },
    { id: 'raise', name: 'RAISE', gm: 52.23, am: 86.28, executions: 19.8, calls: 9.12, tokens: 49.4 },
    { id: 'epic', name: 'EPIC', gm: 71.46, am: 90.25, executions: 13.6, calls: 2.53, tokens: 9.2 }
  ],
  examples: [
    { id: 'monkeys', benchmark: 'GenEval2', atomicity: 9, prompt: 'five red monkeys, and five glass donuts to the left of a metal dog' },
    { id: 'rabbits', benchmark: 'GenEval2', atomicity: 5, prompt: 'six rabbits on top of a wooden suitcase' },
    { id: 'motorcycles', benchmark: 'GenEval2', atomicity: 10, prompt: 'two stone motorcycles behind six green rabbits behind a black violin' },
    { id: 'bicycle', benchmark: 'GenEval2', atomicity: 6, prompt: 'a bicycle to the left of a rabbit, and five brown turtles' },
    { id: 'violins', benchmark: 'GenEval2', atomicity: 6, prompt: 'three white violins and three sparkling horses' },
    { id: 'layout', benchmark: 'GenEval2', atomicity: 9, prompt: 'a yellow car to the left of a purple bicycle in front of five checkered chairs' },
    { id: 'cars', benchmark: 'DrawBench', atomicity: null, prompt: 'Five cars on the street.' },
    // T2I-CompBench++: method names follow the corrected source manifest.
    { id: 'chickens-bees', benchmark: 'T2I-CompBench++', atomicity: null, prompt: 'four chickens and two bees', methodNames: { bon: 'BoN-32' } },
    { id: 'monkeys-umbrellas', benchmark: 'GenEval2', atomicity: 9, prompt: 'four monkeys in front of a plastic flower to the left of five purple umbrellas' },
    { id: 'trucks', benchmark: 'T2I-CompBench++', atomicity: null, prompt: 'two trucks unloaded their cargo', methodNames: { bon: 'BoN-32' } }
  ]
};
