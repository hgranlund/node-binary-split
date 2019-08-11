# Binary Split

[![GitHub stars](https://img.shields.io/github/stars/hgranlund/node-binary-split.svg?style=social&label=Stars)](https://github.com/hgranlund/node-binary-split)
[![npm version](https://badge.fury.io/js/node-binary-split.svg)](https://badge.fury.io/js/node-binary-split)
[![Build](https://travis-ci.org/hgranlund/node-binary-split.png)](http://travis-ci.org/hgranlund/node-binary-split)
[![Coverage Status](https://coveralls.io/repos/github/hgranlund/node-binary-split/badge.svg?branch=master)](https://coveralls.io/github/hgranlund/node-binary-split?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github//hgranlund/node-binary-split/badge.svg)](https://snyk.io/test/github//hgranlund/node-binary-split)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Transform Stream that splits a binary stream into chunks based on a delimiter. The delimiter can be a String or a Buffer.

## Install

```bash
npm install node-binary-split --save
```

## Usage

```js
const split = require('node-binary-split');

split(delimiter);
```

or

```js
const Split = require('node-binary-split');

new Split(delimiter);
```

delimiter can be a string or a buffer.

### Sample

```javascript
const split = require('node-binary-split');
fs.createReadStream(file)
  .pipe(split('\n'))
  .on('data', function(line) {
    //each chunk now is a separate line!
  });
```

## Benchmarks

Benchmarking node-binary-split against other similar packages with benchmark.js. One with [newline](https://raw.githubusercontent.com/hgranlund/node-binary-split/master/bench/benchmark.js) as delimiter and one with a [longer string](https://raw.githubusercontent.com/hgranlund/node-binary-split/master/bench/benchmark-string.js)

```bash
Split on a string:

node-binary-split x 1,368 ops/sec ±3.68% (70 runs sampled)
binary-split x 773 ops/sec ±2.75% (74 runs sampled)
split x 504 ops/sec ±2.02% (75 runs sampled)
split2 x 486 ops/sec ±1.95% (75 runs sampled)
Fastest is node-binary-split
```

```bash
Split on newline:

node-binary-split x 1,682 ops/sec ±3.51% (72 runs sampled)
binary-split x 472 ops/sec ±2.68% (76 runs sampled)
split x 574 ops/sec ±3.34% (73 runs sampled)
split2 x 477 ops/sec ±2.51% (77 runs sampled)
Fastest is node-binary-split
```

## Development

### Test

Run tests by:

```bash
npm test
```

Run benchmarks by:

```bash
npm run bench
```

## Support

Submit an [issue](https://github.com/hgranlund/node-binary-split/issues/new)

## Contribute

[Contribute](https://github.com/hgranlund/node-binary-split/blob/master/CONTRIBUTING.md) usage docs

## License

[MIT License](https://github.com/hgranlund/node-binary-split/blob/master/LICENSE)

[Simen Haugerud Granlund](https://hgranlund.com) © 2019

## Credits

- [Simen Haugerud Granlund](https://hgranlund.com) - Author
