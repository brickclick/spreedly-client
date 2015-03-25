var util = require('../util'),
	CreditCard = require('../credit-card'),
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
		.then(util.extractRoot())
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
		.then(util.extractRoot())
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
		.then(util.extractRoot())
		.nodeify(cb);
};

Gateways.updateGateway = function updateGateway(gatewayToken, credentials, cb) {
	// Allow caller to pass in gateway objects
	gatewayToken = gatewayToken.token || gatewayToken;

	var postData =  util.preparePost('gateway', credentials);
	return this._doRequest({
		url: 'gateways/' + gatewayToken + '.xml',
		method: 'put',
		body: postData
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

Gateways.redactGateway = function redactGateway(gatewayToken, cb) {
	// Allow caller to pass in gateway objects
	gatewayToken = gatewayToken.token || gatewayToken;

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '/redact.xml',
		method: 'put'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

Gateways.showGateway = function showGateway(gatewayToken, cb) {
	// Allow caller to pass in gateway objects
	gatewayToken = gatewayToken.token || gatewayToken;

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '.xml'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};