'use strict';

var util = require('../util'),
	CreditCard = require('../credit-card'),
	PaymentMethods = module.exports;

/**
 * Tokenizes a credit card as a payment method to be used in future purchases.
 * Note that unlike Gateways, payment methods are not automatically retained
 * by default, and you must explicitly call retainPaymentMethod or they will
 * only be cached temporarily.
 *
 * @param {CreditCard|Object} creditCard - A CreditCard, or similar object to tokenize
 * @param additionalData - Any additional data you want to forward through to the gateways
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Bluebird} Bluebird promise that is resolved with a transaction element, containing the payment method
 */
PaymentMethods.createCreditCard = function createCreditCard(creditCard, additionalData, cb) {
	if(typeof additionalData === 'function' && !cb) {
		cb = additionalData;
		additionalData = null;
	}

	if(creditCard instanceof CreditCard) {
		creditCard = creditCard.toObject();
	}

	var postData = {
		creditCard: creditCard
	};

	if(additionalData) {
		postData.data = additionalData;
	}

	return this._doRequest({
		url: 'payment_methods.json',
		method: 'post',
		body: util.preparePost('payment_method', postData)
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/**
 * Retains a payment method so it can be used beyond the cached period
 *
 * @param {String|Object} paymentMethod - a Payment Method Element, or payment method token
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Bluebird} Bluebird promise that is resolved a payment method element
 */
PaymentMethods.retainPaymentMethod = function retainPaymentMethod(paymentMethod, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	return this._doRequest({
		url: '/payment_methods/' + paymentMethod + '/retain.json',
		method: 'put'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/**
 * Lists all payment methods in an environment
 *
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Bluebird} Bluebird promise that is resolved with an array of payment method elements
 */
PaymentMethods.listPaymentMethods = function listPaymentMethods(cb) {
	return this._doRequest({
		url: 'payment_methods.json'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

/**
 * Removes any confidential information stored on a payment method, and makes it
 * unusable in future transactions.
 *
 * If the payment method has been stored on a 3rd party gateway, you can pass the gateway
 * token as well to notify the gateway that it can no longer be used, and to remove it
 *
 * @see https://docs.spreedly.com/reference/api/v1/payment_methods/redact/
 *
 * @param {String|Object} paymentMethod - a Payment Method Element, or payment method token
 * @param {String|Object} [removeFromGateway] - a Gateway element, or gateway token to notify
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Bluebird} Bluebird promise that is resolved with a transaction element, including the payment method
 */
PaymentMethods.redactPaymentMethod = function redactPaymentMethod(paymentMethod, removeFromGateway, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;
	removeFromGateway = removeFromGateway && removeFromGateway.token ? removeFromGateway.token : removeFromGateway;

	if(typeof removeFromGateway === 'function' && !cb) {
		cb = removeFromGateway;
		removeFromGateway = null;
	}

	var request;
	if(removeFromGateway) {
		request = this._doRequest({
			url: 'payment_methods/' + paymentMethod + '/redact.json',
			method: 'put',
			body: util.preparePost('transaction', { removeFromGateway: removeFromGateway })
		});
	} else {
		request = this._doRequest({
			url: 'payment_methods/' + paymentMethod + '/redact.json',
			method: 'put'
		});
	}

	return request
		.then(util.extractRoot())
		.nodeify(cb);
};

/**
 * Retrieves a full payment method element and details about a payment method, based on the token.
 *
 * @param {String|Object} paymentMethod - a Payment Method Element, or payment method token
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Bluebird} Bluebird promise that is resolved with a payment method element
 */
PaymentMethods.showPaymentMethod = function showPaymentMethod(paymentMethod, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	return this._doRequest({
		url: 'payment_methods/' + paymentMethod + '.json'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};


/**
 * Retrieves transactions for a payment method
 *
 * @param {String|Object} paymentMethod - a Payment Method Element, or payment method token
 * @param {Function} [cb] A Node.js-style callback
 * @returns {Bluebird} Bluebird promise that is resolved with an array of transaction elements
 */
PaymentMethods.getPaymentMethodTransactions = function getPaymentMethodTransactions(paymentMethod, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	return this._doRequest({
		url: 'payment_methods/' + paymentMethod + '/transactions.json'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

PaymentMethods.updateCreditCard = function updateCreditCard(paymentMethod, creditCard, additionalData, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	if(typeof additionalData === 'function' && !cb) {
		cb = additionalData;
		additionalData = null;
	}

	if(creditCard instanceof CreditCard) {
		creditCard = creditCard.toObject();
	}

	if(creditCard.verificationValue) {
		delete creditCard.verificationValue;
	}
	if(creditCard.number) {
		delete creditCard.number;
	}

	return this._doRequest({
		url: 'payment_methods/' + paymentMethod + '.json',
		method: 'put',
		body: util.preparePost('payment_method', { creditCard: creditCard })
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

PaymentMethods.recacheVerificationValue = function recacheVerificationValue(paymentMethod, verificationValue, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	return this._doRequest({
		url: 'payment_methods/' + paymentMethod + '/recache.json',
		method: 'post',
		body: util.preparePost('payment_method', { creditCard: { verificationValue: verificationValue } })
	})
		.then(util.extractRoot())
		.nodeify(cb);
};