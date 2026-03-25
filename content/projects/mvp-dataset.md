+++
title = "mvp-dataset"
date = 2026-03-25T12:00:00Z
draft = false
summary = "A minimal, high-performance data loading library for multimodal training pipelines, designed for local shard-based datasets and deterministic throughput."
thumbnail = "/images/mvp-dataset-thumb.png"
topic = "Open Source Project"
github = "https://github.com/mvp-ai-lab/mvp-dataset"
+++

`mvp-dataset` is a lightweight data loading library for multimodal model
training.

It is designed around a few practical goals:

- a minimal API surface
- deterministic runtime behavior
- strong throughput on local shard-based datasets
- compatibility with PyTorch training pipelines

The library supports local tar shards, JSONL metadata files, sidecar tar joins,
and `tar://` reference resolution for datasets that mix structured records with
external media assets.

Its core workflow is well suited to training setups where multimodal data is
stored locally and needs to be shuffled, batched, and merged efficiently
without giving up determinism across distributed and worker processes.
