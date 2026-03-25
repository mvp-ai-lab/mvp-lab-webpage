+++
title = "mvp-dataset: deterministic data loading for multimodal training"
date = 2026-03-25T11:00:00Z
draft = false
summary = "mvp-dataset is a minimal, high-performance data loading library for multimodal training pipelines, with local tar and JSONL support, deterministic sharding, and PyTorch loader integration."
thumbnail = "/images/mvp-dataset-thumb.png"
topic = "Open Source Project"
github = "https://github.com/mvp-ai-lab/mvp-dataset"
+++

`mvp-dataset` is an MVP Lab project for local, shard-based data loading in
multimodal training systems.

The library is built around a deliberately small API surface:

- `Dataset`
- `TorchLoader`
- `RuntimeContext`

That design keeps the library focused on a few practical requirements that show
up repeatedly in real training pipelines:

1. high throughput on local tar-shard datasets
2. deterministic sharding and shuffle behavior across workers
3. simple support for multimodal joins and references

`mvp-dataset` supports two main source types:

- local `.tar` shards through `Dataset.from_tars(...)`
- local `.jsonl` files through `Dataset.from_jsonl(...)`

For tar-based workflows, the library can parse samples directly from shard
members and join sidecar tar files on the fly. For JSONL-based workflows, it
can resolve `tar://...` references so structured metadata and external image or
other modality assets stay connected without moving everything into one format.

The project also includes chainable pipeline operations such as `map`,
`shuffle`, `batch`, and `unbatch`, plus `TorchLoader` for PyTorch
`DataLoader`-style training loops with loader-side pipeline composition.
