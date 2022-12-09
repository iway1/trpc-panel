---
title: vs. trpc-playground
---

# trpc-panel or trpc-playground

Like `trpc-panel`, `trpc-playground` allows easily manually testing your trpc backend with 0 overhead. However, `trpc-playground` requires developers to write code and use the trpc client directly. If that is your preferred method of testing, that's great.

However, using `trpc-panel` may be faster since it generates typesafe forms and provides and intuitive UI for scouting your trpc router. Plus, `trpc-playground` is only suitable for developers since it involves writing code.

## Headers

It doesn't seem that `trpc-playground` supports headers at the moment, so if you need to access protected routes it may not be possible
