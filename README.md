# Neutrino Svelte loader middleware

[![npm](https://img.shields.io/npm/v/neutrino-middleware-svelte-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-svelte-loader)
[![npm](https://img.shields.io/npm/dt/neutrino-middleware-svelte-loader.svg)](https://www.npmjs.com/package/neutrino-middleware-svelte-loader)

`neutrino-middleware-svelte-loader` is a [Neutrino](https://neutrino.js.org) middleware for compiling HTML components with [Svelte](https://svelte.technology). It is compatible with **.html**, **.htm** and **.svelte** files.

## Requirements

* Node.js v6.9+
* Neutrino v5+
* Svelte v1.44.0+

## Installation

`neutrino-middleware-svelte-loader` can be installed from NPM.

```bash
❯ npm install --save neutrino-middleware-svelte-loader
```

## Usage

`neutrino-middleware-svelte-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package and plug it into Neutrino:

```js
const svelteLoader = require('neutrino-middleware-svelte-loader')

neutrino.use(svelteLoader, {
  include: [],
  exclude: [],
  svelte: { emitCss: true }
})
```

* `include`: optional array of paths to include in the compilation. Maps to Webpack's rule.include.
* `exclude`: optional array of paths to exclude from the compilation. Maps to Webpack's rule.include.
* `svelte`: optional object to pass to [`svelte-loader`](https://github.com/sveltejs/svelte-loader) options.

It is recommended to call this middleware after the `neutrino.config.module.rule('compile')` initialization to avoid unexpected overriding and to support transpilation of Svelte components. More information about usage of Neutrino middlewares can be found in the [documentation](https://neutrino.js.org/middleware).

## Rules

This is a list of rules that are used by `neutrino-middleware-svelte-loader`:

* `svelte`: Compiles Svelte components to JavaScript modules. Contains a single loader named the same `svelte`.
* `html`: Compiles Svelte components to JavaScript modules. Contains a single loader named `svelte`. Override this if you want a different loader for HTML files.
* `compile`: Only necessary file extensions added.