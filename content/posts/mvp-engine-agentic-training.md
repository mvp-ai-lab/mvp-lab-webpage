+++
title = "MVP Engine: agentic training recipes for multimodal models"
date = 2026-05-19T17:50:00+01:00
draft = false
summary = "MVP Engine is a lightweight multimodal training framework that keeps orchestration small, moves experiment logic into recipes, and lets coding agents apply reusable skills directly where the training code lives."
thumbnail = "/assets/posts/mvp-engine-agentic-training/thumbnail.png"
topic = "Infrastructure"
github = "https://github.com/mvp-ai-lab/mvp-engine"
website = "https://mvp-ai-lab.github.io/mvp-engine/"
featured = true
featured_title = "Keep training engines small and recipes concrete."
featured_tag = "Open Source"
featured_image = "/assets/posts/mvp-engine-agentic-training/thumbnail.png"
+++

`MVP Engine` is a lightweight training engine for multimodal model research.
Its design starts from a blunt preference: avoid over-abstraction.

Most training frameworks become complicated because they try to support every
model family, data format, parallel strategy, optimizer, scheduler, and
training trick through one reusable API surface. That pressure is real. The
cost is also real: simple experiments become buried under config switches,
adapters, hooks, registries, and indirection.

`MVP Engine` takes a narrower stance. The stable core lives in `mvp_engine/`.
Experiment-specific model, data, optimizer, scheduler, and training logic live
in `recipes/`. Reusable patterns that are not truly core infrastructure live in
`skills/`, where a coding agent can apply them directly to the target recipe.

That split is the interesting part. Instead of forcing every variation into the
engine, MVP Engine treats the recipe as the place where concrete training code
should remain visible. Skills provide agent-facing instructions for recurring
patterns such as parallelism, gradient checkpointing, freeze policies, packing,
loss guards, debugging, and migration steps. The agent uses those instructions
to edit the recipe itself.

The result is a training stack with three layers:

- `mvp_engine/` for launch, config merge, distributed setup, logging,
  checkpointing, and the base training loop
- `recipes/` for experiment-specific model, data, config, and training logic
- `skills/` for reusable coding-agent instructions that customize recipes

The core engine is intentionally ordinary. The base `Engine` workflow follows
`before_train -> do_train -> after_train`, while subclasses implement
preparation methods and step hooks such as `train_pre_step` and `forward_step`.
Hydra handles config merging, and `mvp_engine.launch` launches `train`,
`evaluate`, or custom workflows.

That means a new experiment does not need to become a new global abstraction.
It can be a recipe. If a recipe needs tensor parallelism, a freeze policy, data
packing, or a debugging pattern, the coding agent can apply a skill and write
explicit code into that recipe. The engine remains boring; the experiment stays
readable.

This is a good fit for multimodal training because multimodal work changes
shape quickly. One model may need image-text packing. Another may need video
tokens, document crops, special loss guards, or hardware-specific parallelism.
A framework that tries to abstract all of that too early tends to become harder
to reason about than the experiment itself.

The repository's quickstart is also intentionally direct:

```bash
uv venv --python=3.12
source .venv/bin/activate
uv sync

torchrun --nproc_per_node=1 -m mvp_engine.launch \
  --config ./recipes/magic_transformer/configs/train.yaml
```

For builders, the broader idea is simple: keep orchestration stable, keep
recipes concrete, and let agents operate at the level where the experiment
actually lives. That is a different kind of training framework: less cathedral,
more workshop.

Resources:

- [GitHub](https://github.com/mvp-ai-lab/mvp-engine)
- [Tutorial](https://mvp-ai-lab.github.io/mvp-engine/)
