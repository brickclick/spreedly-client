# Spreedly Library for Node.js

## Introduction
A Node.js library for working with the Spreedly API and credit card tokenization service.

***
## API
- [Spreedly](#Spreedly)
    - [`new Spreedly(environmentKey, accessSecret, [options])`](#new-spreedly-environmentkey-accesssecret-options---spreedly)
    
## Spreedly
The main class for working with the Spreedly Environment

#####`new Spreedly(environmentKey, accessSecret, [options])` -> `Spreedly`
Creates a new instance of the Spreedly class, for a given environment key.

Arguments:

- `environmentKey` (String) - Your environment key
- `accessSecret` (String) - Your access secret
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