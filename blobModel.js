var mongoose = require('mongoose');

var BlobSchema = new mongoose.Schema({
	'key': {
		'type': String,
		'required': true,
		'unique': true
	},
	'value': {
		'type': Object,
		'required': true
	}
});

BlobSchema.statics.store = function (key, value, done) {
	var Store = this;
	var query = {key: key};
	var update = {value: value};
	var options = {upsert: true, new: true};
	Store.findOneAndUpdate(query, update, options, function(err, result) {
		if (err) {
			return done(err);
		}
		return done(null, result.value);
	});
};

BlobSchema.statics.read = function (key, done) {
	var Store = this;
	Store.findOne({key: key}, function(err, store) {
		if (err) {
			return done(err);
		}
		if (store === null) {
			return done(null, null);
		}
		return done(null, store.value);
	});
};

BlobSchema.statics.list = function (done) {
	var Store = this;
	Store.find({}, {'key': 1}, function(err, data) {
		return done(err, data);
	});
};

module.exports = function(options) {
	return mongoose.model('Blob', BlobSchema);
};
