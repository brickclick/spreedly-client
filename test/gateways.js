var should = require('chai').should(),
	Spreedly = require('../index'),
	environmentKey = process.env.ENVIRONMENT_KEY,
	accessSecret = process.env.ACCESS_SECRET;

var spreedlyClient = new Spreedly(environmentKey, accessSecret);

describe('Spreedly', function() {
	describe.skip('Gateway Management', function() {
		it('Can list supported gateway types', function(done) {
			spreedlyClient.listAvailableGateways(function(err, result){
				should.not.exist(err);
				should.exist(result);
				result.should.be.an('array');
				done();
			});
		});
		it('Can add a gateway', function(done) {
			spreedlyClient.createGateway('test', function(err, result) {
				should.not.exist(err);
				should.exist(result);

				result.should.be.an('object');
				result.name.should.not.be.empty;
				result.should.contain.all.keys('characteristics', 'createdAt',
					'credentials', 'gatewayType', 'name', 'paymentMethods',
					'redacted', 'state', 'token', 'updatedAt');
				result.state.should.equal('retained');

				done();
			});
		});
		it('Can list provisioned gateways', function(done) {
			spreedlyClient.listGateways(function(err, result){
				should.not.exist(err);
				should.exist(result);
				result.should.be.an('array');
				result.should.not.be.empty; // Assuming the above works
				done();
			});
		});
		it('Can update a provisioned gateway', function(done) {
			spreedlyClient.listGateways(function(err, result) {
				should.not.exist(err);

				var token = result[0].token;

				spreedlyClient.updateGateway(token, { username: 'test' }, function(err, result) {
					should.not.exist(err);
					should.exist(result);
					result.should.be.an('object');

					done();
				});
			});
		});
		it('Can redact a provisioned gateway', function(done) {
			spreedlyClient.listGateways(function(err, result) {
				should.not.exist(err);

				var token = result[0].token;

				spreedlyClient.redactGateway(token, function(err, result) {
					should.not.exist(err);
					should.exist(result);

					result.should.be.an('object');
					result.should.contain.all.keys('createdAt', 'updatedAt',
						'succeeded', 'transactionType', 'message', 'gateway');
					result.succeeded.should.equal(true);
					result.transactionType.should.equal('RedactGateway');
					result.gateway.state.should.equal('redacted');

					done();
				});
			});
		});
		it('Can get info for a single gateway', function(done) {
			spreedlyClient.listGateways(function(err, result) {
				should.not.exist(err);

				var token = result[0].token;

				spreedlyClient.showGateway(token, function(err, result) {
					should.not.exist(err);
					should.exist(result);

					result.should.be.an('object');
					result.name.should.not.be.empty;
					result.should.contain.all.keys('characteristics', 'createdAt',
						'credentials', 'gatewayType', 'name', 'paymentMethods',
						'redacted', 'state', 'token', 'updatedAt');

					done();
				});
			});
		});
	});
});