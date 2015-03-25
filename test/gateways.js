var should = require('chai').should(),
	Promises = require('bluebird'),
	Spreedly = require('../index'),
	environmentKey = process.env.ENVIRONMENT_KEY,
	accessSecret = process.env.ACCESS_SECRET;

var spreedlyClient = new Spreedly(environmentKey, accessSecret);

describe('Spreedly', function() {
	describe('Gateway Management', function() {
		var spreedlyClient;
		before(function(done) {
			spreedlyClient = new Spreedly(environmentKey, accessSecret);

			done();
		});

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
		it('Can redact a provisioned gateway', function(done) {
			spreedlyClient.listGateways(function(err, result) {
				should.not.exist(err);

				var promises = [];
				result.forEach(function(gateway){
					if(gateway.state === 'retained') {
						promises.push(spreedlyClient.redactGateway(gateway.token));
					}
				});
				// Should have one from above
				promises.should.not.be.empty;

				Promises.all(promises).then(function(result) {
					should.exist(result);
					result.should.be.an('array');
					result.should.not.be.empty;

					result[0].should.be.an('object');
					result[0].should.contain.all.keys('createdAt', 'updatedAt',
						'succeeded', 'transactionType', 'message', 'gateway');
					result[0].succeeded.should.equal(true);
					result[0].transactionType.should.equal('RedactGateway');
					result[0].gateway.state.should.equal('redacted');

				})
					.catch(function(err) {
						should.not.exist(err);
					})
					.finally(done);
			});
		});
	});
});