+++
title = "codec-patch-stream: native video decode and patch selection"
date = 2026-03-24T13:00:00Z
draft = false
summary = "codec-patch-stream provides native video decoding and energy-based patch selection, with separate decode and process backends for CPU and GPU pipelines."
thumbnail = "/images/codec-patch-stream-thumb.png"
topic = "Open Source Project"
github = "https://github.com/mvp-ai-lab/codec-patch-stream"
+++

`codec-patch-stream` is an MVP Lab project for high-throughput video ingestion
and patch extraction.

The library exposes two native APIs:

- `decode_only(DecodeConfig)` for uniform sampled decode output
- `patch_stream(PatchStreamConfig)` for decode plus energy-based patch selection

Its recent API design separates video decode from patch processing more
explicitly:

- `decode_backend`, `decode_device_id`
- `process_backend`, `process_device_id`

That split makes mixed CPU and GPU execution easier to control in real
pipelines, especially when decode and downstream patch processing have
different hardware requirements.

The project supports four runtime combinations in GPU builds:

1. `cpu -> cpu`
2. `cpu -> gpu`
3. `gpu -> cpu`
4. `gpu -> gpu`

In practice, `codec-patch-stream` is useful for model pipelines that need fast
video frame access, patch-level selection, and clear control over where decode
and patch computation happen.
