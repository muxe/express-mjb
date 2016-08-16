var _ = require('lodash');

var defaults = {
	'authMiddleware': function(req, res, next) {
		return next();
	},
	'baseUrl': '/'
};

module.exports = function(options) {
	return _.merge(defaults, options);
}
