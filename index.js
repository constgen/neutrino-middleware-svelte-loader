'use strict'

let path = require('path')
let arrify = require('arrify')
let merge = require('deepmerge')

module.exports = function (neutrino, options = {}) {
	const NODE_MODULES = path.join(__dirname, 'node_modules')
	const LOADER_EXTENSIONS = /\.(html?|svelte|svlt)$/
	const LOADER_HTML_EXTENSIONS = /\.(html?)$/
	const LOADER_SVELTE_EXTENSIONS = /\.(svelte|svlt)$/
	let config = neutrino.config
	let compileRule = config.module.rule('compile')
	let htmlRule = config.module.rule('html')
	let svelteRule = config.module.rule('svelte')
	let compileExtensions = arrify(compileRule.get('test')).concat(LOADER_EXTENSIONS)
	

	// default values
	if (!options.include && !options.exclude) {
		options.include = [neutrino.options.source, neutrino.options.tests]
	}

	compileRule
		.test(compileExtensions)

	htmlRule
		.test(LOADER_HTML_EXTENSIONS)

	svelteRule
		.test(LOADER_SVELTE_EXTENSIONS);

	[htmlRule, svelteRule].forEach(rule => rule
		.include
			.merge(options.include || [])
			.end()
		.exclude
			.add(NODE_MODULES)
			.merge(options.exclude || [])
			.end()
		.use('svelte')
			.loader(require.resolve('svelte-loader'))
			.tap((opts = {}) => merge({
				format: 'es',
				generate: 'dom', //ssr
				name: 'SvelteComponent',
				// filename: 'SvelteComponent.html',
				// shared: true,
				// sourcemap disabling is not implemented in Svelte Compiler
				dev: true,
				css: true
			}, opts))
			.tap((opts = {}) => merge(opts, options))
			.end()
		.use('extract-html')
			.loader(require.resolve('extract-loader'))
			.end()
		.use('html')
			.loader(require.resolve('html-loader'))
			.tap((opts = {}) => merge({
				attrs: ['img:src', 'script:src', 'link:href', 'source:src', 'source:srcset'],
				minimize: false
			}, opts))
			.end()
	)
		
	config
		.resolve.extensions
			.merge(['.html', '.htm', '.svelte', '.svlt'])
			.end().end()
		.resolveLoader.modules
			.add(NODE_MODULES)
			.end().end()
}