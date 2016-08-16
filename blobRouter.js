var express = require('express');
var router = express.Router();
var pug = require('pug');
var bodyParser = require('body-parser');

// module.exports = router;
module.exports = function(options) {
	var Blob = require('./blobModel')(options);
	var config = require('./blobConfig')(options);

	var pugOptions = {};

	var pugList = pug.compileFile(__dirname + '/views/list.pug', pugOptions);
	var pugEdit = pug.compileFile(__dirname + '/views/edit.pug', pugOptions);
	var pugAdd = pug.compileFile(__dirname + '/views/add.pug', pugOptions);

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

			return res.send(pugList({
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
			return res.send(pugEdit({
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

			return res.send(pugEdit({
				blob: JSON.stringify(stored),
				blobJson: stored,
				key: key,
				baseUrl: config.baseUrl
			}));
		});
	});

	router.get('/add', function(req, res, next) {
		return res.send(pugAdd({
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
			return res.send(pugEdit({
				blob: JSON.stringify(stored),
				key: key,
				baseUrl: config.baseUrl
			}));
		});
	});

	return router;
};
