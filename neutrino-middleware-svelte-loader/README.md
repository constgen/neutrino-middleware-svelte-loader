# Neutrino Svelte loader middleware

[![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url]

`neutrino-middleware-svelte-loader` is a Neutrino middleware for compiling HTML components with Svelte. It is compatible with **.html**, **.htm** and **.svelte** files.

## Requirements

* Node.js v6.9+
* Neutrino v5

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

* `include` - optional array of paths to include in the compilation. Maps to Webpack's Rule.include
* `exclude` - optional array of paths to exclude from the compilation. Maps to Webpack's Rule.include

## Rules

This is a list of rules that are used by `neutrino-middleware-svelte-loader`:

* `svelte`: Compiles Svelte components to JavaScript modules. Contains a single loader named the same `svelte`.


