'use strict'

let path = require('path')
let arrify = require('arrify')
let merge = require('merge')

module.exports = function (neutrino, options = {}) {
	const NODE_MODULES = path.join(__dirname, 'node_modules')
	const LOADER_EXTENSIONS = /\.(html?|svelte|svlt)$/
	let config = neutrino.config
	let svelteRule = config.module.rule('svelte')
	let compileRule = config.module.rule('compile')
	let lintRule = config.module.rules.get('lint')
	let eslintLoader = lintRule && lintRule.uses.get('eslint')
	let stylelintPlugin = config.plugins.get('stylelint')
	let compileLoaderExtensions = arrify(compileRule.get('test')).concat(LOADER_EXTENSIONS)
	let lintLoaderExtensions = arrify(lintRule && lintRule.get('test')).concat(LOADER_EXTENSIONS)

	compileRule
		.test(compileLoaderExtensions)

	svelteRule
		.test(LOADER_EXTENSIONS)
		.include
			.merge(options.include || [])
			.end()
		.exclude
			.add(NODE_MODULES)
			.merge(options.exclude || [])
			.end()
		.use('svelte')
			.loader(require.resolve('svelte-loader'))
			.options({
				format: 'es',
				generate: 'dom', //ssr
				name: 'SvelteComponent',
				// filename: 'SvelteComponent.html',
				// shared: true,
				dev: true,
				css: true
			})
			.end()
	
	config
		.resolve.extensions
			.add('.html')
			.add('.htm')
			.add('.svelte')
			.add('.svlt')
			.end().end()
		.resolveLoader.modules
			.add(NODE_MODULES)
			.end().end()

	if (eslintLoader) {
		lintRule
			.pre()
			.test(lintLoaderExtensions)
		eslintLoader
			.tap(options => merge(options, {
				plugins: ['html'],
				settings: {
					'html/html-extensions': ['.svelte', '.svlt', '.html', '.htm']
				}
			}))
			.end()
	}

	if (stylelintPlugin) {
		stylelintPlugin
			.tap(args => [
				merge(args[0], {
					files: ['**/*.(html?|svelte|svlt)'],
					config: {
						processors: [require.resolve('stylelint-processor-html')]						
					}
				})
			])
	}
}