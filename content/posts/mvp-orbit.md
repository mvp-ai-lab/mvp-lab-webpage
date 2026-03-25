+++
title = "mvp-orbit: HTTP-based remote execution for distributed AI workflows"
date = 2026-03-25T09:00:00Z
draft = false
summary = "mvp-orbit is a small HTTP-based remote execution loop for preparing code on one machine, sending it to another, executing commands there, and streaming output back immediately."
thumb = "camera"
thumbnail = "/images/mvp-orbit-thumb.png"
topic = "Open Source Project"
github = "https://github.com/mvp-ai-lab/mvp-orbit"
+++

`mvp-orbit` is an MVP Lab project focused on a specific remote execution
workflow:

1. prepare code on one machine
2. send it to another machine
3. execute commands there
4. stream output back immediately

The project is designed for settings where SSH is unavailable, inconvenient, or
too manual for repeated execution loops. That makes it especially relevant for
AI coding agents, GPU or NPU debugging, and workflows where code is prepared on
one machine but needs to run elsewhere.

The system is structured around three decoupled roles:

- `Hub`: the control plane that stores packages, commands, shell sessions,
  tokens, and ownership metadata
- `Agent`: the execution side that polls the Hub for work and runs commands on
  its own machine
- `User`: the control side that sends commands to the Hub and targets a
  specific Agent

In practice, `mvp-orbit` supports three main user-facing actions: deterministic
package upload, remote command execution, and persistent shell sessions with
reconnect support.
