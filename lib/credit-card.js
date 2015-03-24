var Tarot = require('tarot-js'),
	cardTypes = {
		'visa': {
			pattern: /^4/,
			length: [13, 16],
			cvcLength: [3]
		},
		'master': {
			pattern: /^5[0-5]/,
			length: [16],
			cvcLength: [3]
		},
		'american_express': {
			pattern: /^3[47]/,
			length: [15],
			cvcLength: [3, 4]
		},
		'discover': {
			pattern: /^6([045]|22)/,
			length: [16],
			cvcLength: [3]
		},
		'jcb': {
			pattern: /^35/,
			length: [16],
			cvcLength: [3]
		},
		'diners_club': {
			pattern: /^3[0689]/,
			length: [14],
			cvcLength: [3]
		},
		'dankort': {
			pattern: /^5019/,
			length: [16],
			cvcLength: [3]
		}
	},
	lunhCheck = function lunhCheck(num) {
		var digit, digits, odd, sum, _i, _len;
		odd = true;
		sum = 0;
		digits = (num + '').split('').reverse();
		for (_i = 0, _len = digits.length; _i < _len; _i++) {
			digit = digits[_i];
			digit = parseInt(digit, 10);
			if ((odd = !odd)) {
				digit *= 2;
			}
			if (digit > 9) {
				digit -= 9;
			}
			sum += digit;
		}
		return sum % 10 === 0;
	};

var CreditCard = module.exports = function CreditCard(firstName, lastName, email, number, month, year, cvc) {
	if(arguments.length === 1) {
		// Only one argument -- must be track data.
		// Guess this is a "card present" transaction.
		var cc = new Tarot(firstName);
		this.fullName = cc.cardHolder;
		this.number = cc.number;
		this.month = cc.expiration[0] + cc.expiration[1];
		this.year = '20' + cc.expiration[2] + cc.expiration[3];
		this.trackData = firstName;
	} else if(lastName.indexOf('@') !== -1 && arguments.length == 6) {
		// Lastname is probably an e-mail address, so firstName is fullName
		this.fullName = firstName;
		this.email = lastName;
		this.verificationValue = year;
		this.year = month.length === 4 ? month : '20' + month;
		this.month = number;
		this.number = email;
	} else {
		// We got the whole kit-n-kabootle
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.number = number;
		this.month = month;
		this.year = year.length === 4 ? year : '20' + year;
		this.verificationValue = cvc;
	}

	this.seemsValid = false;
	Object.keys(cardTypes).forEach(function(cardType) {
		if(cardTypes[cardType].pattern.test(this.number) &&
			cardTypes[cardType].length.indexOf(this.number.length) !== -1 &&
			(!this.verificationValue || cardTypes[cardType].cvcLength.indexOf(this.verificationValue.length) !== -1)
		) {
			this.cardType = cardType;
			this.seemsValid = lunhCheck(this.number);
		}
	}, this);
};

CreditCard.prototype.toObject =
	function toObject() {
		var result = {
			number: this.number,
			month: this.month,
			year: this.year
		};

		['fullName', 'firstName', 'lastName',
			'email', 'verificationValue',
			'trackData', 'cardType'].forEach(function(field){
				if(this[field]) {
					result[field] = this[field];
				}
			}, this);

		return result;
	};

CreditCard.prototype.setBillingAddress =
	function setBillingAddress(address1, address2, city, state, zip, country, phoneNumber) {
		this.address1 = address1;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.country = country;

		if(address2) {
			this.address2 = address2;
		}

		if(phoneNumber) {
			this.phoneNumber = phoneNumber;
		}
	};

CreditCard.prototype.setShippingAddress =
	function setShippingAddress(address1, address2, city, state, zip, country, phoneNumber) {
		this.shippingAddress1 = address1;
		this.shippingCity = city;
		this.shippingState = state;
		this.shippingZip = zip;
		this.shippingCountry = country;

		if(address2) {
			this.shippingAddress2 = address2;
		}

		if(phoneNumber) {
			this.shippingPhoneNumber = phoneNumber;
		}
	};