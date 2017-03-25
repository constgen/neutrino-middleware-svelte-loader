'use strict'

let path = require('path')

module.exports = function (neutrino, options) {
	let config = neutrino.config
	let NODE_MODULES = path.join(__dirname, 'node_modules')

	options = options || {}
	config.module.rule('svelte')
		.test(/\.(html?|svelte)$/)
		.include
			.merge(options.include || [])
			.end()
		.exclude
			.add(NODE_MODULES)
			.merge(options.exclude || [])
			.end()
		.use('svelte')
			.loader(require.resolve('svelte-loader'))
			.options({})
			.end()

	config.resolve.extensions.add('.html')
	config.resolve.extensions.add('.htm')
	config.resolve.extensions.add('.svelte')
	config.resolveLoader.modules.add(NODE_MODULES)
}