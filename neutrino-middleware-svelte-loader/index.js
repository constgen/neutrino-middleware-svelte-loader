'use strict'

var path = require('path')

module.exports = function (neutrino) {
	var config = neutrino.config
	var NODE_MODULES = path.join(process.cwd(), 'node_modules')

	config.module.rule('html')
		.uses.clear()

	config.module.rule('svelte')
		.test(/\.(html|htm|svelte)$/)
		.include
			.add(neutrino.options.source)
			.add(neutrino.options.tests)
			.end()
		.exclude
			.add(NODE_MODULES)
			.end()
		.use('svelte')
			.loader(require.resolve('svelte-loader'))
			.options({})
			.end()

	config.resolve.extensions.add('.html')
	config.resolve.extensions.add('.svelte')
}