+++
title = "mvp-orbit"
date = 2026-03-25T10:00:00Z
draft = false
summary = "A small HTTP-based remote execution loop for sending code to another machine, executing there, and streaming results back immediately."
thumbnail = "/images/mvp-orbit-thumb.png"
topic = "Open Source Project"
github = "https://github.com/mvp-ai-lab/mvp-orbit"
+++

`mvp-orbit` is a practical remote execution system built for repeated AI and
systems workflows across multiple machines.

Its design centers on three separate roles:

- `Hub`: the control plane
- `Agent`: the execution side
- `User`: the control side

This structure allows the User and Agent to communicate through the Hub over
HTTP without requiring direct connectivity to each other.

The project is particularly useful for:

- AI coding agents that need remote execution
- GPU, NPU, or embedded debugging loops
- workflows where code is built on one machine and run on another

Core runtime actions in `mvp-orbit` include package upload, command execution,
and persistent remote shell sessions.
