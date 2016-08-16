express-mjb
=========

Manage-JSON-Blobs with express and mongodb

## Installation

  npm install express-mjb --save

## Usage

```javascript
var mjbOptions = {};
var mjb = require('express-mjb')(mjbOptions);

...

app.use('/mjb', mjb.router);
```

## Example

```javascript
var express = require('express');
var mongoose = require('mongoose');
var mjbOptions = {
	'baseUrl': '/mjb',
	//auth middleware to use
	'authMiddleware': function(req, res, next) {
		if (true) {
			return next();
		} else {
			return res.send('Not Allowed');
		}
	},
};
var mjb = require('express-mjb')(mjbOptions);

var app = express();
mongoose.connect("mongodb://localhost:27017/mjb", {}, function(err) {
	if (err) throw err;
	console.log('Successfully connected to MongoDB');
});

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.use('/mjb', mjb.router);

app.listen(3000, function () {
	console.log('MJB Test app listening on port 3000!');
});
```

## Release History

* 0.1.0 Initial release
