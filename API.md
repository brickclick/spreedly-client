# API
- [Spreedly](#Spreedly)
    - [`new Spreedly(environmentKey, accessSecret, [options])`](#new-spreedly-environmentkey-accesssecret-options---spreedly)
    - [`.listAvailableGateways([cb])` -> `Promise`](#listavailablegatewayscb---promise)
    - [`.createGateway(gatewayType, [credentials], [cb])` -> `Promise`](#creategatewaygatewaytype-credentials-cb---promise)
    - [`.listGateways([cb])` -> `Promise`](#listgatewayscb---promise)
    - [`.updateGateway(gatewayToken, [credentials], [cb])` -> `Promise`](#updategatewaygatewaytoken-credentials-cb---promise)
    - [`.redactGateway(gatewayToken, [cb])` -> `Promise`](#redactgatewaygatewaytoken-cb---promise)
    - [`.showGateway(gatewayToken, [cb])` -> `Promise`](#showgatewaygatewaytoken-cb---promise)
    - *(additional documentation coming soon)*
    
## Spreedly
The main class for working with the Spreedly Environment

#####`new Spreedly(environmentKey, accessSecret, [options])` -> `Spreedly`
Creates a new instance of the Spreedly class, for a given environment key.

Arguments:

- `environmentKey` (String) - Your [environment key] (https://docs.spreedly.com/guides/account/#environments)
- `accessSecret` (String) - Your [access secret] (https://docs.spreedly.com/guides/account/#access-secrets)
- `options` (Object) [optional] - Key/Value object of additional options for the Spreedly API.

    Currently the only options are as follows:
    
    - `endpoint`: The URL for the Spreedly endpoint (defaults to `https://core.spreedly.com`)
    - `endpointVersion`: The version identifier to use on the endpoint (defaults to `1`)

Example:
```javascript
var client = new Spreedly('PBto36...', 'zSBH9...');

client.listAvailableGateways(function(err, gateways) {
    ...
});
```

***

#####`.listAvailableGateways([cb])` -> `Promise`
Lists all available gateway types on the Spreedly API

See: https://docs.spreedly.com/reference/api/v1/gateways/options-index/

Arguments:

- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Array` - An array of [gateway abstract elements] (https://docs.spreedly.com/reference/api/v1/gateways/options-index/#response-attributes)

***

#####`.createGateway(gatewayType, [credentials], [cb])` -> `Promise`
Creates and retains a gateway in your environment

See: https://docs.spreedly.com/reference/api/v1/gateways/create/

Arguments:

- `gatewayType` (String) - [One of the specified types] (https://docs.spreedly.com/reference/api/v1/gateways/create/#direct-gateways) of gateway to create. 
- `credentials` (Object) [optional] - Key/Value object of gateway credentials, depending on gateway type
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [gateway element] (https://docs.spreedly.com/reference/api/v1/gateways/create/#response-attributes)

Example:

```javascript
var credentials = { login: 'yourinfo', password: 'yourtxnkey' };
client.createGateway('authorize_net', credentials, function(err, result) {
    // err handling
    console.log(JSON.stringify(result));
    /* Outputs:
     *  {
     *    "token": "XmUqcjE8pDPU3hFPJYXxK3MUtag",
     *    "gatewayType": "authorize_net",
     *    "login": "yourinfo",
     *    ...
     *  }
     */
});
```

***

#####`.listGateways([cb])` -> `Promise`
Lists all gateways that have been provisioned in your Spreedly environment

See: https://docs.spreedly.com/reference/api/v1/gateways/index.html

Arguments:

- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Array` - An array of [gateway elements] (https://docs.spreedly.com/reference/api/v1/gateways/index.html#response-attributes)

***

#####`.updateGateway(gatewayToken, [credentials], [cb])` -> `Promise`
Updates credentials for a gateway. If the gateway was redacted, it will be set back to retained.

See: https://docs.spreedly.com/reference/api/v1/gateways/update/

Arguments:

- `gatewayType` (String|Object) - A gateway token, or a gateway element containing a token of the gateway to update  
- `credentials` (Object) [optional] - Key/Value object of updated gateway credentials, depending on gateway type
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [gateway element] (https://docs.spreedly.com/reference/api/v1/gateways/update/#response-attributes)

Example:

```javascript
var newCredentials = { login: 'newinfo', password: 'newtxnkey' };
client.updateGateway('XmUqcjE8pDPU3hFPJYXxK3MUtag', newCredentials, function(err, result) {
    // err handling
    console.log(JSON.stringify(result));
    /* Outputs:
     *  {
     *    "token": "XmUqcjE8pDPU3hFPJYXxK3MUtag",
     *    "gatewayType": "authorize_net",
     *    "login": "newinfo",
     *    ...
     *  }
     */
});
```

***

#####`.redactGateway(gatewayToken, [cb])` -> `Promise`
Redacts gateway, deleting confidential information associated with it, and disabling it for use in transactions.

See: https://docs.spreedly.com/reference/api/v1/gateways/redact/

Arguments:

- `gatewayToken` (String|Object) - A gateway token, or a gateway element containing a token of the gateway to redact  
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [transaction element] (https://docs.spreedly.com/reference/api/v1/gateways/redact/#response-attributes)

Example:

```javascript
client.redactGateway('XmUqcjE8pDPU3hFPJYXxK3MUtag', function(err, result) {
    // err handling
    console.log(JSON.stringify(result));
    /* Outputs:
     *  {
     *    "token": "U22hixA5wvOnM6hhB50pffV77b4",
     *    "succeeded": true,
     *    "transactionType": "RedactPaymentMethod",
     *    ...
     *  }
     */
});
```

***

#####`.showGateway(gatewayToken, [cb])` -> `Promise`
Retrieves a full gateway element and details about a gateway, based on the token.

See: https://docs.spreedly.com/reference/api/v1/gateways/show/

Arguments:

- `gatewayToken` (String|Object) - A gateway token, or a gateway element containing a token of the gateway  
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [gateway element] (https://docs.spreedly.com/reference/api/v1/gateways/show/#response-attributes)

Example:

```javascript
client.showGateway('XmUqcjE8pDPU3hFPJYXxK3MUtag', function(err, result) {
    // err handling
    console.log(JSON.stringify(result));
    /* Outputs:
     *  {
     *    "token": "H3mc5hZXWlJtlggH6DbSr8HINGv",
     *    "gatewayType": "authorize_net",
     *    "login": "newinfo",
     *    ...
     *  }
     */
});
```

***

#####`.createCreditCard(creditCard, [additionalData], [cb])` -> `Promise`
Tokenizes a credit card as a payment method to be used in future purchases.
Note that unlike Gateways, payment methods are not automatically retained
by default, and you must explicitly call retainPaymentMethod or they will
only be cached temporarily.

See: https://docs.spreedly.com/reference/api/v1/payment_methods/create_authd/

Note that you probably shouldn't use this method. It's a better idea to forward data
directly to Spreedly using their [Javascript API] (https://docs.spreedly.com/reference/api/v1/payment_methods/create_js/)
or their [Transparent Redirect Method] (https://docs.spreedly.com/reference/api/v1/payment_methods/create_tr/).

This method requires that users' credit card information is transmitted to you, and stored in memory
on your servers, and thus increases your PCI compliance requirements.

Arguments:

- `creditCard` (CreditCard|Object) - A prepared CreditCard instance, or similar object to tokenize
- `additionalData` (String|Object) [optional] - Any additional data you want to forward through to the gateways
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [transaction element] (https://docs.spreedly.com/reference/api/v1/payment_methods/create_authd/#response-attributes)

***

#####`.retainPaymentMethod(paymentMethod, [cb])` -> `Promise`
Retains a payment method so it can be used beyond the caching period.

See: https://docs.spreedly.com/reference/api/v1/payment_methods/retain/

Arguments:

- `paymentMethod` (String|Object) - A Payment Method Element, or payment method token
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [payment method element] (https://docs.spreedly.com/reference/api/v1/payment_methods/retain/#response-attributes)

***

#####`.listPaymentMethods([cb])` -> `Promise`
Retains a payment method so it can be used beyond the caching period.

See: https://docs.spreedly.com/reference/api/v1/payment_methods/index.html

Arguments:

- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Array` - An array of [payment method elements] (https://docs.spreedly.com/reference/api/v1/payment_methods/index.html#response-attributes)

***

#####`.redactPaymentMethod(paymentMethod, [removeFromGateway], [cb])` -> `Promise`
Removes any confidential information stored on a payment method, and makes it
unusable in future transactions.

If the payment method has been stored on a 3rd party gateway, you can pass the gateway
token as well to notify the gateway that it can no longer be used.

See: https://docs.spreedly.com/reference/api/v1/payment_methods/redact/
 
Arguments:

- `paymentMethod` (CreditCard|Object) - A Payment Method Element, or payment method token
- `removeFromGateway` (String|Object) [optional] - A Gateway element, or gateway token for the 3rd party gateway
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [transaction element] (https://docs.spreedly.com/reference/api/v1/payment_methods/redact/#response-attributes)

***

#####`.showPaymentMethod(paymentMethod, [cb])` -> `Promise`
Retrieves a full payment method element and details about a payment method, based on the token.

See: https://docs.spreedly.com/reference/api/v1/payment_methods/show/
 
Arguments:

- `paymentMethod` (String|Object) - A Payment Method Element, or payment method token
- `cb` (Function callback) [optional] - A Node.js-style callback

Result: `Object` - A [payment method element] (https://docs.spreedly.com/reference/api/v1/payment_methods/show/#response-attributes)