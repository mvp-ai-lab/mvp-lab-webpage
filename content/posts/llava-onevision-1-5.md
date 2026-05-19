+++
title = "LLaVA-OneVision-1.5: reproducible multimodal training at scale"
date = 2026-05-19T17:00:00+01:00
draft = false
summary = "LLaVA-OneVision-1.5 turns multimodal model release into a reproducible training system, opening the data, recipes, configs, logs, checkpoints, and evaluation commands behind a competitive vision-language model family."
thumbnail = "/assets/posts/llava-onevision-1-5/thumbnail.png"
topic = "Multimodal Research"
github = "https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-1.5"
website = "https://anxiangsir.github.io/pages/llava_onevision1_5/"
paper = "https://arxiv.org/abs/2509.23661"
featured = true
featured_title = "Make multimodal training reproducible end to end."
featured_tag = "Research"
featured_image = "/assets/posts/llava-onevision-1-5/thumbnail.png"
+++

`LLaVA-OneVision-1.5` is interesting less because it is another
vision-language model release, and more because it treats reproducibility as
part of the artifact.

The project opens the training data, model checkpoints, toolchains, configs,
logs, and evaluation commands behind a competitive multimodal model family. In
a field where many strong systems disclose model behavior but only partially
disclose data recipes and training schedules, that is a meaningful shift: the
model is not just something to download, but a system others can inspect,
rerun, and adapt.

The core release centers on a concept-balanced 85M image-text pretraining
dataset and a curated 22M instruction dataset. The pretraining corpus combines
large heterogeneous sources, then uses visual-concept balancing to reduce
long-tail sparsity: images and a large concept vocabulary are embedded into a
shared space, concepts are retrieved for each image, and inverse-frequency
resampling boosts rare entities, attributes, and scenes.

That data choice matters because multimodal models often fail in the tail, not
only at the architecture level. Better coverage of rare concepts gives the
model more chances to learn fine-grained distinctions before instruction
tuning asks it to reason about documents, charts, scenes, and visual details.

The instruction dataset is also deliberately broad. It covers captioning,
charts and tables, code and math, domain-specific questions, general VQA,
grounding and counting, OCR, and science. The project page describes a pipeline
of aggregation, format standardization, instruction rewriting, bilingual
conversion, template diversification, and safety filtering. The important part
is not any single category; it is that the instruction mixture is treated as an
engineering object with balance and format discipline.

On the visual side, LLaVA-OneVision-1.5 adopts `RICE-ViT` as the vision
encoder. Instead of relying only on global image-text contrastive alignment,
RICE-ViT adds region-based cluster discrimination so the encoder can model
local entities, text regions, and object-level semantics. The project reports
training this visual backbone on 450M images and 2.4B candidate regions, with
2D rotary position encoding for native multi-resolution support.

The training recipe is compact: a three-stage pipeline, offline parallel data
packing, and hybrid parallelism for large-scale training. The page reports
offline packing compression of up to roughly 11x, and notes that Stage-1.5
pretraining of the 8B model can complete on 128 A800 GPUs in about four days.
Those numbers are useful because they make the release legible as an execution
plan, not only as a benchmark table.

For builders, the most valuable part is the release surface:

- code and demos on GitHub
- technical report on arXiv
- model checkpoints on Hugging Face
- 85M mid-training data and 22M instruction data
- evaluation commands through `lmms-eval`
- deployment coverage through NVIDIA Megatron-NeMo-AutoModel

That makes the project a practical reference for teams trying to understand
how modern multimodal systems are assembled. You can inspect the data mixture,
run the model, evaluate it on public benchmarks, and compare the engineering
choices against your own constraints.

There is also an RL post-training direction on the same project page:
`LLaVA-OneVision-1.5-RL` uses 67K curated examples and discrepancy-driven data
selection to improve STEM, coding, and reasoning benchmarks while preserving
visual understanding. That sits naturally on top of the base release: once the
vision-language foundation is reproducible, post-training becomes another
stage that can be studied rather than guessed.

The broader lesson is simple: openness in multimodal AI is no longer just
about weights. The useful unit of release is the full training system: data,
sampling, encoder, packing, schedules, evaluation, and logs. LLaVA-OneVision-1.5
is a strong example of that direction.

Resources:

- [Project page](https://anxiangsir.github.io/pages/llava_onevision1_5/)
- [Code](https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-1.5)
- [Technical report](https://arxiv.org/abs/2509.23661)
- [Models and datasets](https://huggingface.co/collections/lmms-lab/llava-onevision-15-68d385fe73b50bd22de23713)
- [Demo](https://huggingface.co/spaces/lmms-lab/LLaVA-OneVision-1.5)
