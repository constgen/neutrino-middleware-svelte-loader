# Neutrino Svelte loader middleware

[![npm](https://img.shields.io/npm/v/neutrino-middleware-svelte-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-svelte-loader)
[![npm](https://img.shields.io/npm/dt/neutrino-middleware-svelte-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-svelte-loader)

`neutrino-middleware-svelte-loader` is a [Neutrino](https://neutrino.js.org) middleware for compiling HTML components with [Svelte](https://svelte.technology). It is compatible with **.html**, **.htm**, **.svelte** and **.svlt** files.

## Requirements

* Node.js v6.9+
* Neutrino v5 and v6

## Installation

`neutrino-middleware-svelte-loader` can be installed from NPM.

```
❯ npm install --save neutrino-middleware-svelte-loader
```

## Usage

`neutrino-middleware-svelte-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package and plug it into Neutrino:

```js
const svelteLoader = require('neutrino-middleware-svelte-loader')

neutrino.use(svelteLoader, {
  include: [],
  exclude: []
})
```

* `include`: optional array of paths to include in the compilation. Maps to Webpack's Rule.include
* `exclude`: optional array of paths to exclude from the compilation. Maps to Webpack's Rule.include

It is recommended to call this middlware after the `neutrino.config.module.rule('compile')` initialization to avoid unexpected overriding. More imformation about usage of Neutrino middlwares can be found in the [documentation](https://neutrino.js.org/middleware).

## Rules

This is a list of rules that are used by `neutrino-middleware-svelte-loader`:

* `svelte`: Compiles Svelte components to JavaScript modules. Contains a single loader named the same `svelte`.
* `html`: Compiles Svelte components to JavaScript modules. Contains a single loader named `svelte`. Override this if you want a different loader for HTML files.
* `compile`: Only necessary file extension added.


