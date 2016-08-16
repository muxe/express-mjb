module.exports = function (options) {
	var blobRouter = require('./blobRouter')(options);
	var blobModel = require('./blobModel')(options);

	return {
		router: blobRouter,
		model : blobModel
	}
};
