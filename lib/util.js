'use strict';

var StatusCodeError = require('request-promise/errors').StatusCodeError,
	Bluebird = require('bluebird'),
	prequest = require('request-promise'),
	humps = require('humps'),
	/* jshint -W079 */
	_ = require('lodash');
	/* jshint +W079 */

var util = module.exports;

/**
 * Performs an HTTP request on the Spreedly API
 * @param {String} urlBase The base URL to request
 * @param {String} key The Environment Key
 * @param {String} secret The Environment Secret
 * @param {String} opts Additional request options
 * @returns {Promise} Result promise
 */
util.doRequest = function doRequest(urlBase, key, secret, opts) {
	// Add auth information to basic request options
	var reqOpts = _.extend({}, {
		auth: {
			user: key,
			pass: secret,
			sendImmediately: true
		},
		json: true
	}, opts);

	// Add the base to the specified URL
	reqOpts.url = urlBase + reqOpts.url;

	if(typeof reqOpts.body !== 'undefined') {
		reqOpts.headers = reqOpts.headers || {};
		// Spreedly will always use application/xml body
		if(!reqOpts.headers['Content-Type']) {
			reqOpts.headers['Content-Type'] = 'application/json';
		}
	}

	return prequest(reqOpts)
		.then(function(result){
			return result;
		})
		.then(util.parseSpreedlyResponse) // Pretty-up the objects
		.then(function(result) {
			// Change spreedly_result to spreedlyResult
			return humps.camelizeKeys(result);
		})
		.catch(function(err){ return err instanceof StatusCodeError; }, function(err) {
			return Bluebird.resolve((err && err.error) || { error: 'Error did not contain a valid response' })
				.then(util.parseSpreedlyResponse)
				.then(humps.camelizeKeys)
				.then(util.extractRoot())
				.then(function(result) {
					return Bluebird.reject(result);
				});
		});
};

util.parseSpreedlyResponse = function parseSpreedlyResponse(value) {
	if(_.isArray(value)) {
		// Iterate over each item
		value.forEach(function(item, index){
			value[index] = util.parseSpreedlyResponse(item);
		});
		return value;
	} else if(_.isPlainObject(value)) {
		_.forEach(value, function(val, key) {
			switch(key) {
				case 'created_at':
				case 'updated_at':
					value[key] = new Date(val);
					break;
				default:
					value[key] = util.parseSpreedlyResponse(val);
			}
		});
	}
	return value;
};

util.preparePost = function preparePost() {
	var args = Array.prototype.slice.apply(arguments),
		root = args.shift();

	args.unshift({});
	var postData = _.extend.apply(null, args);

	postData = humps.decamelizeKeys(postData);

	// Set the "root"
	var result = {};
	result[root] = postData;
	return result;
};

util.extractRoot = function extractRoot(name) {
	return function(value) {
		if(!name && value) {
			var keys;
			try {
				keys = Object.keys(value);
			} catch (e) { }
			if(keys && keys.length) {
				name = keys.shift();
			}
		}

		if(!value || !value.hasOwnProperty(name)) {
			throw new Error(name + ' not set on promise result');
		}

		return value[name];
	};
};
