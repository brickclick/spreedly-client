'use strict';
/**
 * @external Bluebird
 */
var util = require('../util'),
	Gateways = module.exports;

/**
 * Lists all available gateway types on the Spreedly API
 * @method listAvailableGateways
 * @memberof Spreedly.prototype
 * @param {Spreedly~availableGatewaysCallback} [cb] A Node.js, error-first style callback.
 * @returns {Bluebird} A promise resolved with an array of {@link Spreedly~availableGateway availableGateways}
 */
Gateways.listAvailableGateways = function listAvailableGateways(cb) {
	return this._doRequest({
		url: 'gateways_options.json'
	})
	.then(util.extractRoot())
	.nodeify(cb);
};

/**
 * Creates and retains a gateway in your environment
 * @method  createGateway
 * @memberof Spreedly.prototype
 * @param {String} gatewayType One of the specified types of gateways to create
 * @param {Object} [credentials] Key/Value object of gateway credentials, depending on gateway type
 * @param {Spreedly~gatewayCallback} [cb] A Node.js, error-first style callback.
 * @returns {Bluebird} Bluebird promise that is resolved with a {@link Spreedly~gateway gateway}
 */
Gateways.createGateway = function createGateway(gatewayType, credentials, cb) {
	credentials = credentials || {};

	if(typeof credentials === 'function') {
		cb = credentials;
		credentials = {};
	}

	return this._doRequest({
		url: 'gateways.json',
		method: 'post',
		body: util.preparePost('gateway', credentials, { gatewayType: gatewayType })
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/*
 * Lists all gateways that have been provisioned in your Spreedly environment
 *
 * #lends Spreedly.prototype
 * #param {Function} [cb] A Node.js-style callback
 * #returns {Bluebird} Bluebird promise that is resolved with an array of gateway elements
 */
Gateways.listGateways = function listGateways(cb) {
	return this._doRequest({
		url: 'gateways.json'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/*
 * Updates credentials for a gateway. If the gateway was redacted, it will be set back to retained.
 *
 * #lends Spreedly.prototype
 * #param {String|Object} gatewayToken A gateway token, or a gateway element containing a token of the gateway to update
 * #param {Object} [credentials] Key/Value object of updated gateway credentials, depending on gateway type
 * #param {Function} [cb] A Node.js-style callback
 * #returns {Bluebird} Bluebird promise that is resolved with the updated gateway element
 */
Gateways.updateGateway = function updateGateway(gatewayToken, credentials, cb) {
	// Allow caller to pass in gateway objects
	gatewayToken = gatewayToken.token || gatewayToken;

	var postData =  util.preparePost('gateway', credentials);
	return this._doRequest({
		url: 'gateways/' + gatewayToken + '.json',
		method: 'put',
		body: postData
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/*
 * Redact a gateway
 *
 * #lends Spreedly.prototype
 * #param {String|Object} gatewayToken A gateway token, or a gateway element containing a token of the gateway to redact
 * #param {Function} [cb] A Node.js-style callback
 * #returns {Bluebird} Bluebird promise that is resolved with a transaction element
 */
Gateways.redactGateway = function redactGateway(gatewayToken, cb) {
	// Allow caller to pass in gateway objects
	gatewayToken = gatewayToken.token || gatewayToken;

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '/redact.json',
		method: 'put'
	})
		.then(util.normalizeResult)
		.then(util.extractRoot())
		.nodeify(cb);
};

/*
 * Retrieves a full gateway element and details about a gateway, based on the token.
 *
 * #lends Spreedly.prototype
 * #param {String|Object} gatewayToken A gateway token, or a gateway element containing a token of the gateway
 * #param {Function} [cb] A Node.js-style callback
 * #returns {Bluebird} Bluebird promise that is resolved with the gateway element
 */
Gateways.showGateway = function showGateway(gatewayToken, cb) {
	// Allow caller to pass in gateway objects
	gatewayToken = gatewayToken.token || gatewayToken;

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '.json'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/**
 * @typedef {Object} Spreedly~availableGateway
 * @prop {string} gatewayType The type (short name) of the gateway. Use this value when provisioning a gateway.
 * @prop {string} name The human readable name of the gateway
 * @prop {Spreedly~authMode[]} authModes A list of authorization modes for the gateway. An auth mode is basically a list of credentials required for this gateway (some gateways support various ways of entering credentials).
 * @prop {string[]} characteristics A list of operations (such as purchase, capture etc…) that the gateway supports
 * @prop {string[]} paymentMethods A list of payment methods (such as credit_card, apple_pay etc…) that the gateway supports
 * @prop {Object[]} gatewaySpecificFields The list of gateway specific fields that can be specified in supported gateway transactions
 * @prop {string[]} supportedCountries The list of countries this gateway supports ISO2
 * @prop {string[]} supportedCardtypes The list of credit card brands this gateway supports
 * @prop {string[]} regions The list of geographic regions this gateway supports (determined by the supported_countries)
 * @prop {string} homepage The URL to the payment processor's homepage
 * @prop {string} companyName The name of the gateway's company
 */

/**
 * @typedef {Object} Spreedly~authMode
 * @prop {string} authModeType The type of the auth mode: "default", or any special case specific to the gateway
 * @prop {string} name The name of the authentication mode
 * @prop {Spreedly~credential[]} credentials The credentials required for this authentication mode
 */

/**
 * @typedef {Object} Spreedly~credential
 * @prop {string} name The submitted name of the field required to authenticate
 * @prop {string} label The user-friendly label for the field
 * @prop {bool} safe True if the credential should be masked (e.g. passwords). False if it's safe to display
 */

/**
 * @callback Spreedly~availableGatewaysCallback
 * @param {Error} err The error returned by Spreedly
 * @param {Spreedly~availableGateway[]} gateways A list of available gateways
 */

/**
 * @callback Spreedly~gatewayCallback
 * @param {Error} err The error returned by Spreedly
 * @param {Spreedly~gateway} gateway The gateway that was created
 */

/**
 * @typedef {Object} Spreedly~gateway
 * @prop {string} token The token identifying the provisioned gateway at Spreedly
 * @prop {string} name The human readable name of the gateway
 * @prop {string} gatewayType The type (short name) of the gateway.
 * @prop {string} state The storage state of the gateway (retained, redacted, etc…)
 * @prop {bool} redacted If this gateway is redacted or not
 * @prop {Object} credentials The non-sensitive credentials used for this gateway
 * @prop {string[]} characteristics A list of operations (such as purchase, capture etc…) that the gateway supports
 * @prop {string[]} paymentMethods A list of payment methods (such as credit_card, apple_pay etc…) that the gateway supports
 * @prop {Object[]} gatewaySpecificFields The list of gateway specific fields that can be specified in supported gateway transactions
 */