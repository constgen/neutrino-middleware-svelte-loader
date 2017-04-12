'use strict'

let path = require('path')
let arrify = require('arrify')
let merge = require('deepmerge')

module.exports = function (neutrino, options = {}) {
	const NODE_MODULES = path.join(__dirname, 'node_modules')
	const LOADER_EXTENSIONS = /\.(html?|svelte|svlt)$/
	let config = neutrino.config
	let compileRule = config.module.rule('compile')
	let svelteRule = config.module.rule('svelte')
	let lintRule = config.module.rules.get('lint')
	let eslintLoader = lintRule && lintRule.uses.get('eslint')
	let stylelintPlugin = config.plugins.get('stylelint')
	let compileLoaderExtensions = arrify(compileRule.get('test')).concat(LOADER_EXTENSIONS)
	let lintLoaderExtensions = arrify(lintRule && lintRule.get('test')).concat(LOADER_EXTENSIONS)

	// default values
	if (!options.include && !options.exclude) {
		options.include = [neutrino.options.source, neutrino.options.tests]
	}

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
		.use('extract-html')
			.loader(require.resolve('extract-loader'))
			.end()
		.use('html')
			.loader(require.resolve('html-loader'))
			.options({
				attrs: ["img:src", "script:src", "link:href", "source:src", "source:srcset"],
				minimize: false
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
					'html/html-extensions': ['.html', '.htm', '.svelte', '.svlt']
				}
			}))
			.end()
	}

	if (stylelintPlugin) {
		stylelintPlugin
			.tap(args => [
				merge(args[0], {
					files: ['**/*.+(html|htm|svelte|svlt)'],
					config: {
						processors: [require.resolve('stylelint-processor-html')],
						rules: {'no-empty-source': null}					
					}
				})
			])
	}
}