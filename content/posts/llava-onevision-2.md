+++
title = "LLaVA-OneVision-2: open long-video multimodal training"
date = 2026-05-19T17:30:00+01:00
draft = false
summary = "LLaVA-OneVision-2 extends fully open multimodal training toward long-video understanding, using codec-aligned inputs, a four-stage recipe, length-stratified video captions, and a unified OneVision-Encoder."
thumbnail = "/assets/posts/llava-onevision-2/thumbnail.png"
topic = "Multimodal Research"
github = "https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-2"
website = "https://evolvinglmms-lab.github.io/LLaVA-OneVision-2/"
paper = "https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-2#citation"
featured = true
featured_title = "Train open multimodal models for long video."
featured_tag = "Research"
featured_image = "/assets/posts/llava-onevision-2/thumbnail.png"
+++

`LLaVA-OneVision-2` pushes the LLaVA-OneVision line from open multimodal
training into long-video understanding. The project keeps the same core
principle as OneVision-1.5: the useful release is not just a checkpoint, but a
complete recipe with data, training stages, evaluation, and deployment
artifacts that others can inspect and reproduce.

The main change is temporal scale. The page frames OneVision-2 as a fully open
8B-class vision-language training recipe that extends video comprehension from
short 30-second clips toward videos up to 15 minutes. That shift changes the
problem: the model needs to preserve motion, reason over longer event chains,
and avoid wasting context on redundant frames.

<figure class="article-media">
  <video class="article-video" controls muted autoplay loop playsinline poster="/assets/posts/llava-onevision-2/thumbnail.png">
    <source src="/assets/posts/llava-onevision-2/codec-vs-frame.webm" type="video/webm">
  </video>
  <figcaption>Codec-selected patches keep motion-dense evidence while uniform frame sampling stays sparse under the same budget.</figcaption>
</figure>

The key input idea is codec-aligned sparsity. Instead of treating video as a
flat list of uniformly sampled frames, OneVision-2 uses codec-style evidence:
I-frames remain dense, while P-frames contribute motion-rich patches. Under the
same token budget, this lets the model span more time while keeping fine motion
evidence where it matters.

That design fits the benchmark emphasis. The project reports strong results on
long-video and video reasoning benchmarks such as VideoMME, VideoMME with
subtitles, LVBench, VideoEval-Pro, and MVBench. The exact scores are useful, but
the more interesting story is the evaluation surface: these benchmarks stress
event understanding, temporal grounding, OCR, summarization, action reasoning,
counting, and open-ended long-video QA.

The data recipe is length-stratified. OneVision-2 introduces a video caption
corpus spanning 30 seconds to 15 minutes, totaling roughly 8M captioned clips.
The project page breaks it into buckets:

- 4.2M clips at 30 seconds
- 2.7M clips at 30 to 60 seconds
- 700K clips at 60 to 180 seconds
- 350K clips at 10 to 15 minutes

This matters because long-video learning cannot simply be short-video learning
with more frames. The model needs curriculum: first learn to see short clips,
then extend to minute-scale video, then absorb longer context and denser
temporal supervision.

The training pipeline follows four stages:

1. Bootstrap from LLaVA-OneVision-1.5 with short 30-second video captions.
2. Add instruction tuning and medium-length 30 to 60 second video captions.
3. Train for long-video understanding with 10 to 15 minute captions and video
   instruction corpora.
4. Add longer video, improved codec inputs, spatial reasoning, and tracking
   supervision, including denser 768-frame settings and 4M spatial samples.

The encoder story is also important. OneVision-2 uses a shared OneVision-Encoder
for images, uniform-frame video, and codec-aligned video. All three input types
flow through a common token grid with shared temporal and spatial positions.
That keeps the system from becoming a collection of separate modality-specific
paths, while still giving video its own temporal structure.

For builders, the release is useful as a reference architecture for long-video
multimodal systems:

- codec-aligned token allocation instead of naive frame sampling
- length-stratified video caption data
- a staged curriculum from short clips to long context
- unified image and video encoding under shared position structure
- open code, checkpoints, datasets, and evaluation setup

The broader lesson is that long-video understanding is as much a systems and
data problem as it is a model problem. OneVision-2 treats time as something to
budget carefully: spend tokens on dense evidence when motion changes, skim when
frames are redundant, and train the model across the time scales it will be
asked to reason over.

Resources:

- [Project page](https://evolvinglmms-lab.github.io/LLaVA-OneVision-2/)
- [Code](https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-2)
- [Models and datasets](https://huggingface.co/collections/mvp-lab/llava-onevision-2)
- [Technical report and citation](https://github.com/EvolvingLMMs-Lab/LLaVA-OneVision-2#citation)
