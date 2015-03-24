var should = require('chai').should(),
	CreditCard = require('../lib/credit-card');

describe('CreditCard', function() {
	describe('Instantiating credit cards', function() {
		it('Can create a credit card with first name & last name', function(done) {
			var cc = new CreditCard('Test', 'Name', 'tname@example.com', '4111111111111111', '12', '16', '123');

			should.exist(cc.cardType);
			cc.cardType.should.equal('visa');
			should.exist(cc.seemsValid);
			cc.seemsValid.should.be.true;

			done();
		});
		it('Can create a credit card with full name', function(done) {
			var cc = new CreditCard('Test Name', 'tname@example.com', '378282246310005', '12', '16', '123');

			should.exist(cc.cardType);
			cc.cardType.should.equal('american_express');
			should.exist(cc.seemsValid);
			cc.seemsValid.should.be.true;

			done();
		});
		it('Can create a credit card with track data', function(done) {
			var cc = new CreditCard('%B5555555555554444^JONES/Joey^1705101130504392?');

			should.exist(cc.cardType);
			cc.cardType.should.equal('master');
			should.exist(cc.seemsValid);
			cc.seemsValid.should.be.true;

			done();
		});
	});
});