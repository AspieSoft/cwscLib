# Common Word String Compression Library

![npm version](https://img.shields.io/npm/v/@aspiesoft/cwsclib)
![GitHub top language](https://img.shields.io/github/languages/top/aspiesoft/cwscLib)
![GitHub license](https://img.shields.io/github/license/aspiesoft/cwscLib)

![npm downloads](https://img.shields.io/npm/dw/@aspiesoft/cwsclib)
![npm downloads](https://img.shields.io/npm/dm/@aspiesoft/cwsclib)
![jsDelivr hits (GitHub)](https://img.shields.io/jsdelivr/gh/hm/aspiesoft/cwscLib)

[![paypal](https://img.shields.io/badge/buy%20me%20a%20coffee-paypal-blue)](https://buymeacoffee.aspiesoft.com/)

## A compression library for strings, that recognizes common words, and creates references to them

A compression library for strings, that recognizes common words, and creates references to them.
Because these word references are built within the cdn, they should get cached and reduce the amount of data sent to the client.

This algorithm checks if the string got smaller or larger at each step, and does Not add methods that become larger than the original result from the last method.
The algorithm attempts to reduce repeating words, and generate utf8 character based references to allow fast decompression.

Usually decompression is faster than compression, as compression should make the string as small as possible, and decompression is usually when you actually need the string.

## Installation

### node.js

```shell script

npm install @aspiesoft/cwsclib

# or with no optional dependencies
npm install @aspiesoft/cwsclib --no-optional

```

### cdn

```html

<!-- Optional: add secondary compression (will detect automatically) -->
<script src="https://cdn.jsdelivr.net/gh/nodeca/pako@1.0.11/dist/pako.min.js" charset="utf-8"></script>


<!-- Note: charset="utf-8" is necessary for the script to use utf-8 character references properly -->
<script src="https://cdn.jsdelivr.net/gh/AspieSoft/cwscLib@1/script.min.js" charset="utf-8"></script>

```

## Usage

```JavaScript

// require only if using node.js
const cwscLib = require('@aspiesoft/cwsclib');

let str = 'the cdn.jsdelivr.net javascript engine built in year 2020 by aspiesoft';

let compressed = cwscLib.compress(str, 9).toString(); // output: §1:0><qU> <&> <*b> <NŒ> <Xx> in <l‰> 2020 by <-2>

let decompressed = cwscLib.decompress(compressed); // output: the cdn.jsdelivr.net javascript engine built in year 2020 by aspiesoft

// note: the compressed string may appear different, if you add an optional compression after this compression (depending on if it gets smaller)


let speed = 1; // any number between 0 and 9
/*
  speed = 1 (fastest)
  speed = 9 (best) (default)
*/

let compression = cwscLib.compress(str, speed);
/*
  output: {
    comp: '0><qU> <&> <*b> <NŒ> <Xx> in <l‰> 2020 by <-2>',
    ver: 1,
    compType: 0,
    toString: [Function: toString],
    toJSON: [Function: toJSON],
    decomp: [Function: decomp]
  }
*/

compression.toJSON(); // output: compression object without functions (useful for storing json)

compression.decomp(); // output: original string
cwscLib.decompress(compression); // output: original string
cwscLib.decompress(compression.toJSON()); // output: original string


cwscLib.compress('11111 222 33 4444444 5555555555 6 7 888888888888 999999999999').toString(); // output: §1:1>2:1 0:2 33 4:4 7:5 6 7 9:8 9:9

```
