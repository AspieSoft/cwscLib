const cwscLib = require('./script');

let test = 'the cdn.jsdelivr.net javascript engine built in year 2020 by aspiesoft';
console.log(test);
let comp = cwscLib.compress(test);
console.log(comp.toString());
let decomp = cwscLib.decompress(comp);
console.log(decomp);
console.log('success:', test === decomp);
