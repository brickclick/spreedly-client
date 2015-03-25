var util = require('../util'),
	CreditCard = require('../credit-card'),
	PaymentMethods = module.exports;

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
		url: 'payment_methods.xml',
		method: 'post',
		body: util.preparePost('payment_method', postData)
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

PaymentMethods.retainPaymentMethod = function retainPaymentMethod(paymentMethod, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	return this._doRequest({
		url: '/payment_methods/' + paymentMethod + '/retain.xml',
		method: 'put'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

PaymentMethods.listPaymentMethods = function listPaymentMethods(cb) {
	return this._doRequest({
		url: 'payment_methods.xml'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

PaymentMethods.redactPaymentMethod = function redactPaymentMethod(paymentMethod, removeFromGatewayToken, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	if(typeof removeFromGatewayToken === 'function' && !cb) {
		cb = removeFromGatewayToken;
		removeFromGatewayToken = null;
	}

	var request;
	if(removeFromGatewayToken) {
		request = this._doRequest({
			url: 'payment_methods/' + paymentMethod + '/redact.xml',
			method: 'put',
			body: util.preparePost('transaction', { removeFromGateway: removeFromGatewayToken })
		});
	} else {
		request = this._doRequest({
			url: 'payment_methods/' + paymentMethod + '/redact.xml',
			method: 'put'
		})
	}

	return request
		.then(util.extractRoot())
		.nodeify(cb);
};

PaymentMethods.showPaymentMethod = function showPaymentMethod(paymentMethod, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	return this._doRequest({
		url: 'payment_methods/' + paymentMethod + '.xml'
	})
		.then(util.extractRoot())
		.nodeify(cb);
};

PaymentMethods.getPaymentMethodTransactions = function getPaymentMethodTransactions(paymentMethod, cb) {
	// Allow caller to pass in payment method objects
	paymentMethod = paymentMethod.token || paymentMethod;

	return this._doRequest({
		url: 'payment_methods/' + paymentMethod + '/transactions.xml'
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
		url: 'payment_methods/' + paymentMethod + '.xml',
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
		url: 'payment_methods/' + paymentMethod + '/recache.xml',
		method: 'post',
		body: util.preparePost('payment_method', { creditCard: { verificationValue: verificationValue } })
	})
		.then(util.extractRoot())
		.nodeify(cb);
};