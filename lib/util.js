var IncomingMessage = require('http').IncomingMessage,
	Promise = require('bluebird'),
	prequest = require('prequest'),
	xml2js = require('xml2js'),
	xml2jsParse = Promise.promisify(xml2js.parseString),
	humps = require('humps'),
	_ = require('lodash');

var util = module.exports;

util.doRequest = function doRequest(urlBase, key, secret, opts) {
	// Add auth information to basic request options
	var reqOpts = _.extend({}, {
		auth: {
			user: key,
			pass: secret
		},
		json: false
	}, opts);

	// Add the base to the specified URL
	reqOpts.url = urlBase + reqOpts.url;

	if(typeof reqOpts.body !== 'undefined') {
		reqOpts.headers = reqOpts.headers || {};
		// Spreedly will always use application/xml body
		if(!reqOpts.headers['Content-Type']) {
			reqOpts.headers['Content-Type'] = 'application/xml';
		}
	}

	// Return promise
	return prequest(reqOpts) // Raw HTTP request
		.then(util.parseXML) // Parse XML to JS object
		.then(util.parseSpreedlyResponse) // Pretty-up the objects, parse Spreedly types into JS types
		.then(function(result) {
			// Change spreedly_result to spreedlyResult
			return humps.camelizeKeys(result);
		})
		.catch(function(err){
				return err instanceof IncomingMessage;
			}, function(err) {
				return util.parseXML(err.body)
					.then(util.parseSpreedlyResponse)
					.then(function(result) {
						// Change spreedly_result to spreedlyResult
						result = humps.camelizeKeys(result);
						// Get the main error result
						result = util.extractRoot()(result);

						return Promise.reject(result);
					});
		});
};

util.parseSpreedlyResponse = function parseSpreedlyResponse(value) {
	if(typeof value === 'string') {
		return value.trim();
	} else if(Array.isArray(value)) {
		// Single value array, likely just use the value (parseXML creates these)
		if(value.length === 1) {
			if(typeof value[0] === 'string') {
				return value[0].trim();
			} else {
				return util.parseSpreedlyResponse(value[0])
			}
		} else {
			// Multi-value array. Iterate over each item
			value.forEach(function(item, index){
				value[index] = util.parseSpreedlyResponse(item);
			});
			return value;
		}
	} else {
		var keys = Object.keys(value);
		// One array property-- likely the parent is the real array
		// and this is an array of elements, so extract them
		if(keys.length === 1 && Array.isArray(value[keys[0]])) {
			return util.parseSpreedlyResponse(value[keys[0]]);
		}
		// Tag with type="..." attribute. Cast to JS type
		else if(value._ && value.$ && value.$.type) {
			switch(value.$.type) {
				case 'boolean':
					return value._ === 'true';
				case 'dateTime':
					return Date.parse(value._);
				case 'integer':
					return parseInt(value._);
				default:
					// Unknown type
					return value._;
			}
		}
		// Tag with nil="true" attribute. Use JS's null instead
		else if(value.$ && value.$.nil && value.$.nil === 'true') {
			return null;
		}

		// Didn't match special cases above-- iterate over properties
		keys.forEach(function(key) {
			var parsed = util.parseSpreedlyResponse(value[key]);
			// These should always be an array
			if(!Array.isArray(parsed) &&
				['payment_methods', 'transactions', 'receivers', 'gateways'].indexOf(key) !== -1) {
				parsed = [parsed];
			}
			value[key] = parsed;
		});
	}
	return value;
};

util.parseXML = function parseXML(value) {
	return xml2jsParse(value, {
		ignoreAttrs: false
	});
};

util.preparePost = function preparePost() {
	var args = Array.prototype.slice.apply(arguments),
		root = args.shift();

	args.unshift({});
	var postData = _.extend.apply(null, args);

	postData = humps.decamelizeKeys(postData);

	var xmlBuilder = new xml2js.Builder({
		headless: true,
		rootName: root
	});

	return xmlBuilder.buildObject(postData);
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
	}
};
