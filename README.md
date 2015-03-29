# Spreedly Client for Node.js [![Build Status](https://travis-ci.org/t3rminus/spreedly-client.svg?branch=master)](https://travis-ci.org/t3rminus/spreedly-client)

## Introduction
A Node.js library for working with the [Spreedly API] (https://docs.spreedly.com/reference/api/v1/)
and credit card tokenization service. I've tried to follow the API as closely as possible,
and provided methods for most of the major functions. 

## Property Naming & Result Objects
The Spreedly API returns XML elements that are underscore_separated.
These are converted to lowerCamelCase Javascript objects, and vice-versa when calling a method.
This means that instead of providing a property like `retain_on_success`, you may provide `retainOnSuccess`,
and it will be converted before being sent with the request.
 
Example:
```xml
<gateway>
   <token>H3mc5hZXWlJtlggH6DbSr8HINGv</token>
   <gateway_type>authorize_net</gateway_type>
   <name>Authorize.Net</name>
   <login>Your Authorize.Net API Login ID</login>
</gateway>
```
is converted to
```javascript
{
    token: "H3mc5hZXWlJtlggH6DbSr8HINGv",
    gatewayType: "authorize_net",
    name: "Authorize.Net",
    login: "Your Authorize.Net API Login ID"
}
```
Note that there is no root "gateway" element wrapping everything--
It is assumed that the base object represents the root, and it is not named.

Additionally, in cases where Spreedly provides a concrete data type,
they will be converted to native Javascript types.

Example:
```xml
<examples>
   <supports_purchase type="boolean">true</supports_purchase>
   <created_at type="dateTime">2015-01-08T15:54:55-05:00</created_at>
   <cvv_code nil="true"/>
   <amount type="integer">100</amount>
</examples>
```
becomes
```javascript
{
    supportsPurchase: true,
    createdAt: new Date("2015-01-08T15:54:55-05:00"),
    cvvCode: null,
    amount: 100
}
```

## Callbacks vs. Promises
Why all the fighting and arguing over which way is better?
There is a perfectly good solution: do both. It's easy.

_All_ Spreedly client methods support both an optional Node.js-style
`function(err, result)` callback parameter, and _also_ return a 
[Bluebird promise] (https://github.com/petkaantonov/bluebird).

***
## API
- [Spreedly](#Spreedly)
    - [`new Spreedly(environmentKey, accessSecret, [options])`](#new-spreedly-environmentkey-accesssecret-options---spreedly)
    - [`.listAvailableGateways([cb])` -> `Promise`](#listavailablegatewayscb---promise)
    - [`.createGateway(gatewayType, [credentials], [cb])` -> `Promise`](#creategatewaygatewaytype-credentials-cb---promise)
    - [`.listGateways([cb])` -> `Promise`](#listgatewayscb---promise)
    - [`.updateGateway(gatewayToken, [credentials], [cb])` -> `Promise`](#updategatewaygatewaytoken-credentials-cb---promise)
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
client.createGateway('authorize_net', { login: 'yourinfo', password: 'yourtxnkey' }, function(err, result) {
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
client.updateGateway('XmUqcjE8pDPU3hFPJYXxK3MUtag', { login: 'newinfo', password: 'newtxnkey' }, function(err, result) {
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