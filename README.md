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

View the full API documentation here: