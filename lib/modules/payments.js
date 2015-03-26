var util = require('../util'),
	CreditCard = require('../credit-card'),
	Payments = module.exports;

Payments.authorize = function authorize(gatewayToken, paymentMethod, amount, currency, info, cb) {
	// Allow caller to pass in gateway & payment method objects
	gatewayToken = gatewayToken.token || gatewayToken;
	paymentMethod = paymentMethod.token || paymentMethod;

	if(typeof info === 'function' && !cb) {
		cb = info;
		info = {};
	}

	var postData = {
		amount: Math.round(amount),
		currencyCode: currency
	};

	if(paymentMethod instanceof CreditCard) {
		// We can pass a credit card in here, use it instead of a token
		postData.creditCard = paymentMethod.toObject();
	} else if(typeof paymentMethod === 'string') {
		// It's a string-- must be a token
		postData.paymentMethodToken = paymentMethod;
	}

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '/authorize.xml',
		method: 'post',
		body: util.preparePost('transaction', info, postData)
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

Payments.verify = function verify(gatewayToken, paymentMethod, currency, info, cb) {
	// Allow caller to pass in gateway & payment method objects
	gatewayToken = gatewayToken.token || gatewayToken;
	paymentMethod = paymentMethod.token || paymentMethod;

	if(typeof info === 'function' && !cb) {
		cb = info;
		info = {};
	}

	var postData = {
		paymentMethodToken: paymentMethod,
		currencyCode: currency
	};

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '/verify.xml',
		method: 'post',
		body: util.preparePost('transaction', info, postData)
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

Payments.purchase = function purchase(gatewayToken, paymentMethod, amount, currency, info, cb) {
	// Allow caller to pass in gateway & payment method objects
	gatewayToken = gatewayToken.token || gatewayToken;
	paymentMethod = paymentMethod.token || paymentMethod;

	if(typeof info === 'function' && !cb) {
		cb = info;
		info = {};
	}

	var postData = {
		amount: Math.round(amount),
		currencyCode: currency
	};

	if(paymentMethod instanceof CreditCard) {
		// We can pass a credit card in here, use it instead of a token
		postData.creditCard = paymentMethod.toObject();
	} else if(typeof paymentMethod === 'string') {
		// It's a string-- must be a token
		postData.paymentMethodToken = paymentMethod;
	}

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '/purchase.xml',
		method: 'post',
		body: util.preparePost('transaction', info, postData)
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

Payments.capture = function capture(transaction, amount, currency, info, cb) {
	// Allow caller to pass in transaction result object
	transaction = (transaction && transaction.token) || transaction;

	if(!cb && !currency && !info && typeof amount === 'function') {
		cb = amount;
		amount = null;
	}

	if(!cb && !info && typeof currency === 'function') {
		cb = currency;
		currency = null;
	}

	if(!cb && typeof info === 'function') {
		cb = info;
		info = {};
	}

	info = info || {};

	var request;
	if(amount) {
		// Amount is set. Partial capture, send body
		var postData = { amount: Math.round(amount) };

		if(!currency && transaction && transaction.currencyCode) {
			postData.currencyCode = transaction.currencyCode;
		} else if(currency) {
			postData.currencyCode = currency;
		}

		request = this._doRequest({
			url: 'transactions/' + transaction + '/capture.xml',
			method: 'post',
			body: util.preparePost('transaction', info, postData)
		});
	} else {
		request = this._doRequest({
			url: 'transactions/' + transaction + '/capture.xml',
			method: 'post'
		})
	}

	return request
		.then(util.extractRoot())
		.nodeify(cb);
};

Payments.generalCredit = function generalCredit(gatewayToken, paymentMethod, amount, currency, cb) {
	// Allow caller to pass in gateway & payment method objects
	gatewayToken = gatewayToken.token || gatewayToken;
	paymentMethod = paymentMethod.token || paymentMethod;

	var postData = {
		paymentMethodToken: paymentMethod,
		amount: Math.round(amount),
		currencyCode: currency
	};

	return this._doRequest({
		url: 'gateways/' + gatewayToken + '/purchase.xml',
		method: 'post',
		body: util.preparePost('transaction', postData)
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

Payments.credit = function credit(transaction, amount, currency, info, cb) {
	// Allow caller to pass in transaction result object
	transaction = (transaction && transaction.token) || transaction;

	if(!cb && !currency && !info && typeof amount === 'function') {
		cb = amount;
		amount = null;
	}

	if(!cb && !info && typeof currency === 'function') {
		cb = currency;
		currency = null;
	}

	if(!cb && typeof info === 'function') {
		cb = info;
		info = {};
	}

	info = info || {};

	var request;
	if(amount) {
		// Amount is set. Partial credit, send body
		var postData = { amount: Math.round(amount) };

		if(!currency && transaction && transaction.currencyCode) {
			postData.currencyCode = transaction.currencyCode;
		} else if(currency) {
			postData.currencyCode = currency;
		}

		request = this._doRequest({
			url: 'transactions/' + transaction + '/credit.xml',
			method: 'post',
			body: util.preparePost('transaction', info, postData)
		});
	} else {
		request = this._doRequest({
			url: 'transactions/' + transaction + '/credit.xml',
			method: 'post'
		})
	}

	return request
		.then(util.extractRoot())
		.nodeify(cb);
};

Payments.void = function voidTransaction(transaction, info, cb) {
	// Allow caller to pass in transaction result object
	transaction = (transaction && transaction.token) || transaction;

	if(!cb && typeof info === 'function') {
		cb = info;
		info = null;
	}

	var request;
	if(info) {
		request = this._doRequest({
			url: 'transactions/' + transaction + '/void.xml',
			method: 'post',
			body: util.preparePost('transaction', info)
		});
	} else {
		request = this._doRequest({
			url: 'transactions/' + transaction + '/void.xml',
			method: 'post'
		})
	}

	return request
		.then(util.extractRoot())
		.nodeify(cb);
};