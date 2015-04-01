# Spreedly Client for Node.js [![Build Status](https://travis-ci.org/t3rminus/spreedly-client.svg?branch=master)](https://travis-ci.org/t3rminus/spreedly-client)

[![NPM](https://nodei.co/npm/spreedly-client.png)](https://nodei.co/npm/spreedly-client/)

## Introduction
A Node.js library for working with the [Spreedly](https://spreedly.com/) API and credit card tokenization service.

I've tried to follow the [API](https://docs.spreedly.com/reference/api/v1/) as closely as possible.
This library provides methods for the most common functionality, with additional methods in development.

_All_ Spreedly client methods support both an optional Node.js-style
`function(err, result)` callback parameter, and _also_ return a 
[Bluebird promise](https://github.com/petkaantonov/bluebird), for maximum compatibility and utility.

***

## API

View the full API documentation here: [https://github.com/t3rminus/spreedly-client/blob/master/API.md](https://github.com/t3rminus/spreedly-client/blob/master/API.md)
