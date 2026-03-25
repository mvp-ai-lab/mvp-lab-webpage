+++
title = "codec-patch-stream"
date = 2026-03-24T14:00:00Z
draft = false
summary = "A native video decode and patch-streaming library with configurable CPU and GPU backends for both decode and patch processing."
topic = "Open Source Project"
thumbnail = "/images/codec-patch-stream-thumb.png"
github = "https://github.com/mvp-ai-lab/codec-patch-stream"
+++

`codec-patch-stream` is a systems project for decoding video and selecting
patches efficiently for downstream model pipelines.

It is designed around two core workflows:

- decode-only frame extraction
- decode plus energy-based patch selection

The library separates decode execution from patch processing, which gives
callers explicit control over whether each stage runs on CPU or GPU.

That makes it a good fit for research and production settings where video
throughput, patch efficiency, and hardware placement all matter at the same
time.
