'use strict'

let path = require('path')

module.exports = function (neutrino, options) {
	const NODE_MODULES = path.join(__dirname, 'node_modules')
	const RULE_EXTENSIONS = /\.(html?|svelte)$/
	let config = neutrino.config
	let compileRule = config.module.rules.get('compile')
	let compileRuleExtensions = compileRule && compileRule.get('test') || []
	compileRuleExtensions = (compileRuleExtensions instanceof Array) ? compileRuleExtensions : [compileRuleExtensions]
	let commonRuleExtensions = compileRuleExtensions.concat(RULE_EXTENSIONS)

	options = options || {}
	config.module.rule('compile')
		.test(commonRuleExtensions)

	config.module.rule('svelte')
		.test(RULE_EXTENSIONS)
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