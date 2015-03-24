var util = require('../util'),
	Gateways = module.exports;

/**
 * Lists all gateway types available on Spreedly.
 *
 * @class Spreedly
 * @module Gateways
 * @param {Function} [cb] Node.js-style callback
 * @returns {Promise} Bluebird promise that is resolved with the list of gateways
 */
Gateways.listAvailableGateways = function listAvailableGateways(cb) {
	return this._doRequest({
		url: 'gateways.xml',
		method: 'options'
	})
		.then(util.extractRoot('gateways'))
		.nodeify(cb);
};

/**
 * Creates (& retains) a gateway in your Spreedly environment
 *
 * @class Spreedly
 * @module Gateways
 * @param {String} gatewayType The type of gateway
 * @param {Object} [credentials] Credentials to pass to the gateway
 * @param {Function} [cb] Node.js-style callback
 * @returns {Promise} Bluebird promise that is resolved with the created gateway
 */
Gateways.createGateway = function createGateway(gatewayType, credentials, cb) {
	credentials = credentials || {};

	if(typeof credentials === 'function') {
		cb = credentials;
		credentials = {};
	}

	return this._doRequest({
		url: 'gateways.xml',
		method: 'post',
		body: util.preparePost('gateway', credentials, { gatewayType: gatewayType })
	})
		.then(util.extractRoot('gateway'))
		.nodeify(cb);
};

/**
 * Lists all gateways that have been provisioned in your Spreedly environment
 *
 * @class Spreedly
 * @module Gateways
 * @param {Function} [cb] Node.js-style callback
 * @returns {Promise} Bluebird promise that is resolved with an array of gateways
 */
Gateways.listGateways = function listGateways(cb) {
	return this._doRequest({
		url: 'gateways.xml'
	})
		.then(util.extractRoot('gateways'))
		.nodeify(cb);
};

Gateways.updateGateway = function updateGateway(token, credentials, cb) {
	var postData =  util.preparePost('gateway', credentials);
	return this._doRequest({
		url: 'gateways/' + token + '.xml',
		method: 'put',
		body: postData
	})
		.then(util.extractRoot('gateway'))
		.nodeify(cb);
};

Gateways.redactGateway = function redactGateway(token, cb) {
	return this._doRequest({
		url: 'gateways/' + token + '/redact.xml',
		method: 'put'
	})
		.then(util.extractRoot('transaction'))
		.nodeify(cb);
};

Gateways.showGateway = function showGateway(token, cb) {
	return this._doRequest({
		url: 'gateways/' + token + '.xml'
	})
		.then(util.extractRoot('gateway'))
		.nodeify(cb);
};