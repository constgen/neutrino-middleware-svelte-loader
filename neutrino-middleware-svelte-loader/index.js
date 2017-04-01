'use strict'

let path = require('path')
let arrify = require('arrify')

module.exports = function (neutrino, options) {
	const NODE_MODULES = path.join(__dirname, 'node_modules')
	const LOADER_EXTENSIONS = /\.(html?|svelte|svlt)$/
	let config = neutrino.config
	let compileRule = config.module.rules.get('compile')
	let compileRuleExtensions = arrify(compileRule && compileRule.get('test'))
	let commonRuleExtensions = compileRuleExtensions.concat(LOADER_EXTENSIONS)

	options = options || {}
	config.module.rule('compile')
		.test(commonRuleExtensions)

	config.module.rule('svelte')
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
			.options({})
			.end()

	config.resolve.extensions.add('.html')
	config.resolve.extensions.add('.htm')
	config.resolve.extensions.add('.svelte')
	config.resolve.extensions.add('.svlt')
	config.resolveLoader.modules.add(NODE_MODULES)
}