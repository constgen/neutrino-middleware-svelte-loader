'use strict'

let path = require('path')
let arrify = require('arrify')
let deepmerge = require('deepmerge')

function mergeWith(options = {}){
	return function(opts = {}){
		return deepmerge(opts, options)
	}
}
function mergeTo(options = {}){
	return function(opts = {}){
		return deepmerge(options, opts)
	}
}

module.exports = function (neutrino, settings = {}) {
	const NODE_MODULES = path.join(__dirname, 'node_modules')
	const LOADER_EXTENSIONS = /\.(html?|svelte)$/
	const LOADER_HTML_EXTENSIONS = /\.(html?)$/
	const LOADER_SVELTE_EXTENSIONS = /\.(svelte)$/
	let devMode = (process.env.NODE_ENV === 'development')
	let config = neutrino.config
	let compileRule = config.module.rule('compile')
	let htmlRule = config.module.rule('html')
	let svelteRule = config.module.rule('svelte')
	let compileExtensions = arrify(compileRule.get('test')).concat(LOADER_EXTENSIONS)
	let neutrinoExtensions = neutrino.options.extensions

	function isNotInExtensions (extension) {
		return neutrinoExtensions.indexOf(extension) < 0
	}

	neutrino.options.extensions = neutrinoExtensions.concat(['html', 'htm', 'svelte'].filter(isNotInExtensions))

	// default values
	if (!settings.include && !settings.exclude) {
		settings.include = [neutrino.options.source, neutrino.options.tests]
	}

	if (!settings.svelte) {
		settings.svelte = {}
	}

	compileRule
		.test(compileExtensions)

	htmlRule
		.test(LOADER_HTML_EXTENSIONS)

	svelteRule
		.test(LOADER_SVELTE_EXTENSIONS);

	[htmlRule, svelteRule].forEach(rule => rule
		.include
			.merge(settings.include || [])
			.end()
		.exclude
			.add(NODE_MODULES)
			.merge(settings.exclude || [])
			.end()
		.use('svelte')
			.loader(require.resolve('svelte-loader'))
			.tap(mergeTo({
				// hotReload: true,
				// emitCss: false,
				// format: 'es',
				// generate: 'dom', //or 'ssr'
				dev: devMode
				// css: true
				// preprocess: {
				// 	markup
				// 	style
				// 	script
				// }
			}))
			.tap(mergeWith(settings.svelte))
			.end()
		.use('extract-html')
			.loader(require.resolve('extract-loader'))
			.end()
		.use('html')
			.loader(require.resolve('html-loader'))
			.tap(mergeTo({
				attrs: [':url', 'img:src', 'script:src', 'link:href', 'source:src', 'source:srcset'],
				minimize: false
			}))
			.end()
	)

	config
		.resolve.extensions
			.merge(['.html', '.htm', '.svelte'])
			.end().end()
		.resolve.mainFields
			.merge(['svelte', 'browser', 'module', 'main'])
			.end().end()
		.resolveLoader.modules
			.add(NODE_MODULES)
			.end().end()
}