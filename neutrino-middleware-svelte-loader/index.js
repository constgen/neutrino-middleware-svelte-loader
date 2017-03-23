'use strict'

var path = require('path')

module.exports = function (neutrino, options) {
	var config = neutrino.config
	var NODE_MODULES = path.join(__dirname, 'node_modules')
	var svelteRule = config.module.rule('svelte')

	svelteRule
		.test(/\.(html|htm|svelte)$/)
		.include
			.end()
		.exclude
			.add(NODE_MODULES)
			.end()
		.use('svelte')
			.loader(require.resolve('svelte-loader'))
			.options({})
			.end()

	if (options.include) {
		svelteRule.include.merge(options.include)
	}

	if (options.exclude) {
		svelteRule.exclude.merge(options.exclude)
	}

	config.resolve.extensions.add('.html')
	config.resolve.extensions.add('.htm')
	config.resolve.extensions.add('.svelte')
	config.resolveLoader.modules.add(NODE_MODULES)
}