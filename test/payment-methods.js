'use strict';
/* jshint -W030 */
/* globals describe,it */

var should = require('chai').should(),
	Spreedly = require('../index'),
	CreditCard = require('../lib/credit-card'),
	Promises = require('bluebird'),
	environmentKey = process.env.ENVIRONMENT_KEY,
	accessSecret = process.env.ACCESS_SECRET;

describe('Payment Method Management', function() {
	var spreedlyClient;
	before(function(done) {
		spreedlyClient = new Spreedly(environmentKey, accessSecret);

		done();
	});

	it('Can create a payment method', function(done) {
		var cc = new CreditCard('Test', 'Name', 'tname@example.com', '4111111111111111', '12', '16', '123');
		spreedlyClient.createCreditCard(cc, function(err, result){
			should.not.exist(err);
			should.exist(result);

			result.should.be.an('object');
			result.should.have.any.key('token');
			result.succeeded.should.be.true;

			done();
		});
	});

	it('Can retain a payment method', function(done) {
		var cc = new CreditCard('Test', 'Name', 'tname@example.com', '4111111111111111', '12', '16', '123');
		spreedlyClient.createCreditCard(cc, function(err, result){
			should.not.exist(err);

			var paymentMethodToken = result.paymentMethod.token;

			spreedlyClient.retainPaymentMethod(paymentMethodToken, function(err, result) {
				should.not.exist(err);
				should.exist(result);
				should.exist(result.paymentMethod);

				result.should.be.an('object');
				result.paymentMethod.storageState.should.equal('retained');

				done();
			});
		});
	});

	it('Can list all payment methods', function(done) {
		spreedlyClient.listPaymentMethods(function(err, result){
			should.not.exist(err);
			should.exist(result);

			result.should.be.an('array');
			result.should.not.be.empty; // Assuming the above works

			done();
		});
	});

	it('Can redact a payment method', function(done) {
		spreedlyClient.listPaymentMethods(function(err, result){
			should.not.exist(err);

			var promises = [];
			result.forEach(function(paymentMethod){
				if(paymentMethod.storageState === 'retained') {
					promises.push(spreedlyClient.redactPaymentMethod(paymentMethod.token));
				}
			});
			// Should have one from above
			promises.should.not.be.empty;

			Promises.all(promises).then(function(result) {
				should.exist(result);
				result.should.be.an('array');
				result.should.not.be.empty;

				result[0].should.be.an('object');
				should.exist(result[0].paymentMethod);
				result[0].paymentMethod.storageState.should.equal('redacted');
			})
				.catch(function(err) {
					should.not.exist(err);
				})
				.finally(done);
		});
	});
});