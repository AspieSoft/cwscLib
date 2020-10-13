const fs = require('fs');
const miniforge = require('@aspiesoft/miniforge-js');

miniforge.rootDir(__dirname);

/*const wordList = JSON.stringify(require('./build-word-list'));
fs.writeFileSync('./word-list.json', wordList);*/
const wordList = JSON.stringify(require('./word-list.json'));


fs.writeFileSync('./script.temp.js', fs.readFileSync('./script.js').toString().replace('const commonWords = [];', 'const commonWords = '+wordList+';'));


miniforge.build('./script.temp.js', {
  standAlone: true,
  avoidDependencies: true,
  compress: false,
  encrypt: false,
  outputNameMin: true,
  output: 'script.min.js',
  minify: {
    ecma: 6,
    parse: {ecma: 6},
    compress: {
      ecma: 6,
      keep_infinity: false,
      module: false,
      passes: 5,
      top_retain: ['cwscLib'],
      typeofs: false,
    },
    mangle: {
      keep_classnames: true,
      module: true,
      reserved: ['cwscLib'],
    },
    module: false,
    keep_classnames: true,
    ie8: true,
  }
});

fs.unlinkSync('./script.temp.js');
