+++
title = "RAVEN: real-time autoregressive video extrapolation"
date = 2026-05-19T18:19:00+01:00
draft = false
summary = "RAVEN is a training-time test framework for real-time autoregressive video diffusion, aligning training rollouts with inference-time history and adding CM-GRPO for online consistency-model optimization."
thumbnail = "/assets/posts/raven-real-time-autoregressive-video/thumbnail.png"
topic = "Video Generation Research"
github = "https://github.com/mvp-ai-lab/RAVEN"
website = "https://yanzuo.lu/raven/"
paper = "https://arxiv.org/abs/2605.15190"
featured = true
featured_title = "Stream future video from generated history."
featured_tag = "Research"
featured_image = "/assets/posts/raven-real-time-autoregressive-video/thumbnail.png"
+++

`RAVEN` is a real-time autoregressive video extrapolation system. Its goal is
not simply to generate a short clip, but to keep extending video in chunks while
maintaining quality, motion, and semantic consistency over a longer horizon.

The project targets a specific failure mode in causal video diffusion
distillation. At inference time, an autoregressive generator conditions on its
own previously generated chunks. During training, however, many systems see
cleaner or mismatched history distributions. That mismatch creates what the
project calls a history supervision gap: the model is asked to extrapolate from
history states it was not fully trained to use.

<figure class="article-media">
  <video class="article-video" controls muted autoplay loop playsinline poster="/assets/posts/raven-real-time-autoregressive-video/thumbnail.png">
    <source src="/assets/posts/raven-real-time-autoregressive-video/comparison-reel.mp4" type="video/mp4">
  </video>
  <figcaption>RAVEN comparison reel from the project page, showing long-prompt video generation against causal baselines.</figcaption>
</figure>

RAVEN addresses this by turning training into a training-time test. It rolls the
model forward, then repacks each self rollout into an interleaved sequence of
clean historical endpoints and noisy denoising states. This gives downstream
chunk losses a path to supervise the history representations that future chunks
will actually depend on.

That framing is useful because it makes autoregressive video generation feel
less like independent clip generation and more like a streaming system. The
state carried forward matters. If the state drifts, all future chunks inherit
the problem. If the state is trained under realistic rollout conditions, future
prediction becomes less brittle.

The second contribution is `CM-GRPO`, or Consistency-model Group Relative
Policy Optimization. The method reformulates a consistency sampling step as a
conditional Gaussian transition kernel, then applies online reinforcement
learning directly to that kernel. The project positions this as a better match
for the sampler interface used at inference than prior flow-model RL
formulations that rely on an auxiliary Euler-Maruyama process.

In practice, this gives the system two complementary levers:

- RAVEN aligns autoregressive training with inference-time history.
- CM-GRPO improves the consistency sampling kernel with online optimization.

The project compares against recent causal video baselines including CausVid,
LongLive, Rolling Forcing, Self Forcing, Reward Forcing, and Causal Forcing. The
headline result is that RAVEN improves quality, semantic alignment, and dynamic
degree metrics, with additional gains when CM-GRPO is applied on top.

<figure class="article-media">
  <img src="/assets/posts/raven-real-time-autoregressive-video/preference.png" alt="RAVEN user preference study">
  <figcaption>User study preference rates from the project page, where RAVEN is preferred against multiple short-video causal baselines.</figcaption>
</figure>

The user study is also telling. The project evaluates 100 long and detailed
prompts from baseline qualitative showcases, generating four samples per prompt
for each method. Human raters compare RAVEN clips against baseline clips across
quality, semantic alignment, and overall preference. RAVEN is preferred across
all reported dimensions, with the strongest margin on semantic consistency.

For builders, the interesting lesson is that real-time video generation is not
only about fewer denoising steps. It is about making the training process see
the same kind of imperfect generated history that inference will produce. Once
the model is optimized around that history, streaming generation becomes a
first-class objective rather than an afterthought.

Resources:

- [Project page](https://yanzuo.lu/raven/)
- [Code](https://github.com/mvp-ai-lab/RAVEN)
- [Paper](https://arxiv.org/abs/2605.15190)
- [Model](https://huggingface.co/mvp-lab/RAVEN)
