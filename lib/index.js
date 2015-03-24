/**
 * @author Kevin Smith - kevin@brickclickrms.com
 * @license MIT
 */
var _ = require('lodash'),
	fs = require('fs'),
	util = require('./util');

var defaults = {
	endpoint: 'https://core.spreedly.com',
	endpointVersion: 1
};

/**
 * The main Spreedly environment client
 *
 * @class Spreedly
 * @param {String} environmentKey Your environment key
 * @param {String} accessSecret Your access secret
 * @param {Object} opts Any additional settings to use
 */

var Spreedly = module.exports = function Spreedly(environmentKey, accessSecret, opts) {
	// Set up the options
	this.opts = _.extend({}, defaults, opts);

	// Set up the URL to use
	var urlBase = this.opts.endpoint + '/v' + this.opts.endpointVersion + '/';

	// Wrap the request function (for convenience)
	this._doRequest = function(reqOpts) {
		return util.doRequest(urlBase, environmentKey, accessSecret, reqOpts);
	};
};

// Load modules from the modules folder to extend the prototype
fs.readdirSync(__dirname + '/modules/').forEach(function(file) {
	if(/.*\.js/.test(file)) {
		_.extend(Spreedly.prototype, require('./modules/' + file));
	}
});