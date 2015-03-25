var should = require('chai').should(),
	Promises = require('bluebird'),
	Spreedly = require('../index'),
	CreditCard = require('../lib/credit-card'),
	environmentKey = process.env.ENVIRONMENT_KEY,
	accessSecret = process.env.ACCESS_SECRET;

describe('Spreedly', function() {
	describe('Payments', function() {
		var spreedlyClient, gateway, card;
		before(function(done) {
			spreedlyClient = new Spreedly(environmentKey, accessSecret);

			var cc = new CreditCard('Test', 'Name', 'tname@example.com', '4111111111111111', '12', '16', '123');

			Promises.all([
				spreedlyClient.createGateway('test'),
				spreedlyClient.createCreditCard(cc)
			])
				.then(function(result) {
					gateway = result[0];
					card = result[1];

					return spreedlyClient.retainPaymentMethod(card.paymentMethod);
				}).catch(function(err){
					throw err;
				}).finally(done);
		});

		it('Can verify a payment method', function(done) {
			spreedlyClient.verify(gateway, card.paymentMethod, 'USD', function(err, result) {
				should.not.exist(err);
				should.exist(result);

				result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
				result.response.should.contain.all.keys('success');
				result.response.success.should.be.true;

				done();
			});
		});

		var authorizedPayment;
		it('Can authorize a payment method for $10', function(done) {
			spreedlyClient.authorize(gateway, card.paymentMethod, 1000, 'USD', function(err, result) {
				should.not.exist(err);
				should.exist(result);

				result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
				result.response.should.contain.all.keys('success');
				result.response.success.should.be.true;

				authorizedPayment = result;

				done();
			});
		});

		it('Can capture an authorized payment for $10', function(done) {
			spreedlyClient.capture(authorizedPayment, function(err, result){
				should.not.exist(err);
				should.exist(result);

				result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
				result.response.should.contain.all.keys('success');
				result.response.success.should.be.true;

				done();
			});
		});

		it('Can capture a partial amount on an authorized payment', function(done) {
			spreedlyClient.authorize(gateway, card.paymentMethod, 1000, 'USD', function(err, result) {
				spreedlyClient.capture(result, 500, function(err, result) {
					should.not.exist(err);
					should.exist(result);

					result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
					result.response.should.contain.all.keys('success');
					result.response.success.should.be.true;

					done();
				});
			});
		});

		it('Cannot capture an authorized payment of $0.44 (Spreedly test fail case)', function(done) {
			spreedlyClient.authorize(gateway, card.paymentMethod, 44, 'USD', function(err, result) {
				should.not.exist(err);

				spreedlyClient.capture(result, function(err, result) {
					should.exist(err);
					should.not.exist(result);

					err.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
					err.response.should.contain.all.keys('success');
					err.response.success.should.be.false;

					done();
				});
			});
		});

		it('Can void a payment authorization for $10', function(done) {
			spreedlyClient.authorize(gateway, card.paymentMethod, 1000, 'USD', function(err, result) {
				should.not.exist(err);

				spreedlyClient.void(result, function(err, result) {
					should.not.exist(err);
					should.exist(result);

					result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
					result.response.should.contain.all.keys('success');
					result.response.success.should.be.true;

					done();
				});
			});
		});

		it('Can make a direct purchase', function(done) {
			spreedlyClient.purchase(gateway, card.paymentMethod, 1000, 'USD', function(err, result) {
				should.not.exist(err);
				should.exist(result);

				result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
				result.response.should.contain.all.keys('success');
				result.response.success.should.be.true;

				done();
			});
		});

		it('Can credit a direct purchase (purchase refund)', function(done) {
			spreedlyClient.purchase(gateway, card.paymentMethod, 1000, 'USD', function(err, result) {
				should.not.exist(err);

				spreedlyClient.credit(result, function(err, result) {
					should.not.exist(err);
					should.exist(result);

					result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
					result.response.should.contain.all.keys('success');
					result.response.success.should.be.true;

					done();
				});
			});
		});

		it('Can partially credit a direct purchase (partial purchase refund)', function(done) {
			spreedlyClient.purchase(gateway, card.paymentMethod, 1000, 'USD', function(err, result) {
				should.not.exist(err);

				spreedlyClient.credit(result, 500, function(err, result) {
					should.not.exist(err);
					should.exist(result);

					result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
					result.response.should.contain.all.keys('success');
					result.response.success.should.be.true;

					done();
				});
			});
		});

		it('Can apply a general credit (arbitrary refund)', function(done) {
			spreedlyClient.generalCredit(gateway, card.paymentMethod, 1000, 'USD', function(err, result) {
				should.not.exist(err);
				should.exist(result);

				result.should.contain.all.keys('state','token','succeeded','response','onTestGateway');
				result.response.should.contain.all.keys('success');
				result.response.success.should.be.true;

				done();
			});
		});

		after(function(done){
			Promises.all([
				spreedlyClient.redactPaymentMethod(card.paymentMethod),
				spreedlyClient.redactGateway(gateway)
			])
				.catch(function(err){
					throw err;
				}).finally(done);
		});
	});
});