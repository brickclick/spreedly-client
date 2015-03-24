var util = require('../util'),
	CreditCard = require('../credit-card'),
	PaymentMethods = module.exports;

PaymentMethods.createCreditCard = function createCreditCard(creditCard, additionalData, cb) {
	if(typeof additionalData === 'function') {
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
		.then(util.extractRoot('transaction'))
		.nodeify(cb);
};

PaymentMethods.retainPaymentMethod = function retainPaymentMethod(token, cb) {
	return this._doRequest({
		url: '/payment_methods/' + token + '/retain.xml',
		method: 'put'
	})
		.then(util.extractRoot('transaction'))
		.nodeify(cb);
};

PaymentMethods.listPaymentMethods = function listPaymentMethods(cb) {
	return this._doRequest({
		url: 'payment_methods.xml'
	})
		.then(util.extractRoot('paymentMethods'))
		.nodeify(cb);
};

PaymentMethods.redactPaymentMethod = function redactPaymentMethod(token, removeFromGatewayToken, cb) {
	if(typeof removeFromGatewayToken === 'function') {
		cb = removeFromGatewayToken;
		removeFromGatewayToken = null;
	}

	var request;
	if(removeFromGatewayToken) {
		request = this._doRequest({
			url: 'payment_methods/' + token + '/redact.xml',
			method: 'put',
			body: util.preparePost('transaction', { removeFromGateway: removeFromGatewayToken })
		});
	} else {
		request = this._doRequest({
			url: 'payment_methods/' + token + '/redact.xml',
			method: 'put'
		})
	}

	return request
		.then(util.extractRoot('transaction'))
		.nodeify(cb);
};

PaymentMethods.showPaymentMethod = function showPaymentMethod(token, cb) {
	return this._doRequest({
		url: 'payment_methods/' + token + '.xml'
	})
		.then(util.extractRoot('paymentMethod'))
		.nodeify(cb);
};

PaymentMethods.getPaymentMethodTransactions = function getPaymentMethodTransactions(token, cb) {
	return this._doRequest({
		url: 'payment_methods/' + token + '/transactions.xml'
	})
		.then(util.extractRoot('transactions'))
		.nodeify(cb);
};

PaymentMethods.updateCreditCard = function updateCreditCard(token, creditCard, additionalData, cb) {
	if(typeof additionalData === 'function') {
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
		url: 'payment_methods/' + token + '.xml',
		method: 'put',
		body: util.preparePost('payment_method', { creditCard: creditCard })
	})
		.then(util.extractRoot('payment_method'))
		.nodeify(cb);
};

PaymentMethods.recacheVerificationValue = function recacheVerificationValue(token, verificationValue, cb) {
	return this._doRequest({
		url: 'payment_methods/' + token + '/recache.xml',
		method: 'post',
		body: util.preparePost('payment_method', { creditCard: { verificationValue: verificationValue } })
	})
		.then(util.extractRoot('transaction'))
		.nodeify(cb);
};