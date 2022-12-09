# Contributing

Although `trpc-panel` can provide a lot of value to developers as is, it is in it's infancy and there is a lot of room for improvement. The goal for this library is to make manual testing of trpc end backends as quick and easy as is possible, and to support the majority of trpc backends.

Right now, we're trying to get a better idea of community needs for this library and determine which features would be most valuable to trpc developers and anyone else who might want to use this UI. So, starting a discussion or opening an issue at [https://github.com/iway1/trpc-panel](https://github.com/iway1/trpc-panel) is a great way to contribute! Keep in mind the scope of this library is to build tRPC UIs.

If you want to submit some PRs yourself, checkout the following information.

## Setup Dev Environment

trpc panel is a mono repo composed of 3 apps, the `trpc-panel` package, the `test-app` (which is used for both the online demo and is useful for local development), and the `docs` site (which is this website.)

First clone:

`git clone https://github.com/iway1`

install packages in the root directory:

`yarn`

And then you'll want to startup both the `trpc-panel` package in dev mode and the `test-app` in dev mode so that you can work on stuff.

Start the dev server for `trpc-panel`:

`cd packages/trpc-panel`

`yarn dev`

And then in a different terminal start the dev server in `test-app`

`cd packages/test-app`

`yarn dev`

Hot reloading has been pretty finnicky with this setup so far, so in its current state you may need to restart one or both of the apps on file changes (although I have had it working at some points).

## React App

`trpc-panel` is just a react app that gets bundled with rollup. If you want to make changes to the UI components you will find everything in `src/react-app`.

## Parsing

Parsing is the process of taking a trpc router and turning it into a plain javascript object on the backend, which then gets passed as a prop to the root component in the react app once it actually renders. All of the parsing logic is in `src/parse`. If you wanted to extend support for different input types, for example, that's where you would want to make changes.
