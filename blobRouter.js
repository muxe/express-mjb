var express = require('express');
var router = express.Router();
var jade = require('jade');
var bodyParser = require('body-parser');

// module.exports = router;
module.exports = function(options) {
	var Blob = require('./blobModel')(options);
	var config = require('./blobConfig')(options);

	var jadeOptions = {};

	var jadeList = jade.compileFile(__dirname + '/views/list.jade', jadeOptions);
	var jadeEdit = jade.compileFile(__dirname + '/views/edit.jade', jadeOptions);
	var jadeAdd = jade.compileFile(__dirname + '/views/add.jade', jadeOptions);

	router.use(express.static(__dirname + '/static'));
	router.use(bodyParser.json());
	router.use(bodyParser.urlencoded({
		extended: false
	}));

	router.get('/api/:key', function(req, res, next) {
		var key = req.params.key;
		Blob.read(key, function(err, blob) {
			if (err) {
				return res.json({
					success: false,
					err: err
				});
			}
			if (blob === null) {
				return res.json({
					success: false,
					err: 'Blob not found'
				});
			}
			return res.json({
				success: true,
				key: key,
				blob: blob
			});
		});
	});

	if (config.authMiddleware) {
		router.use(config.authMiddleware);
	}

	router.all('/', function(req, res, next) {
		Blob.list(function(err, keys) {
			if (err) {
				return res.json({
					success: false,
					err: err
				});
			}

			return res.send(jadeList({
				keys: keys,
				baseUrl: config.baseUrl
			}));
		});
	});
	router.post('/api/:key', function(req, res, next) {
		var key = req.params.key;
		var blob = req.body;
		Blob.store(key, blob, function(err, stored) {
			if (err) {
				return res.json({
					success: false,
					err: err
				});
			}
			return res.json({
				success: true,
				key: key,
				blob: stored
			});
		});
	});

	router.get('/edit/:key', function(req, res, next) {
		var key = req.params.key;
		Blob.read(key, function(err, blob) {
			if (err) {
				return res.json({
					success: false,
					err: err
				});
			}
			if (blob === null) {
				return res.json({
					success: false,
					err: 'Blob not found'
				});
			}
			return res.send(jadeEdit({
				blob: JSON.stringify(blob),
				blobJson: blob,
				key: key,
				baseUrl: config.baseUrl
			}));
		});
	});

	router.post('/edit/:key', function(req, res, next) {
		var key = req.params.key;
		var blobRaw = req.body.value;
		var blob = JSON.parse(blobRaw);
		Blob.store(key, blob, function(err, stored) {
			if (err) {
				return res.json({
					success: false,
					err: err
				});
			}

			return res.send(jadeEdit({
				blob: JSON.stringify(stored),
				blobJson: stored,
				key: key,
				baseUrl: config.baseUrl
			}));
		});
	});

	router.get('/add', function(req, res, next) {
		return res.send(jadeAdd({
			baseUrl: config.baseUrl
		}));
	});

	router.post('/add', function(req, res, next) {
		var key = req.body.key;
		var blobRaw = req.body.value;
		var blob = JSON.parse(blobRaw);
		Blob.store(key, blob, function(err, stored) {
			if (err) {
				return res.json({
					success: false,
					err: err
				});
			}
			return res.send(jadeEdit({
				blob: JSON.stringify(stored),
				key: key,
				baseUrl: config.baseUrl
			}));
		});
	});

	return router;
};
