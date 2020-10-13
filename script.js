/*! https://github.com/AspieSoft/cwscLib-js v1.0.2 | (c) aspiesoftweb@gmail.com */
;var cwscLib = (function(){

  const standardComp = [];
  standardComp[1] = jsRequire('pako', 'pako', function(pako){
    return {
      comp: function(str, level){
        return pako.deflate(str, {to: 'string'});
      },
      decomp: function(str){
        return pako.inflate(str, {to: 'string'});
      },
    };
  });


  const commonWords = [];

  const letterIndexes = (function(){
    const letters = '!"#$%&\'*+,-./0123456789;=?@ABCDEFGHIJKLMNOPQRSTUVWXYZ\\^_`abcdefghijklmnopqrstuvwxyz|~€ƒ„…†‡^‰Š‹ŒŽ•™š›œžŸ¡¢£¥¦§©ª«¬®¯°±²³µ¶¹»¼½¾¿';
    let result = '';
    for(let i = 0; i < letters.length; i++){
      if(!result.includes(letters[i])){
        result += letters[i];
      }
    }
    return result;
  })();


  const comp = [];
  const decomp = [];

  comp[1] = function(str, level = 9){
    if(level < 1 || level > 9){
      return str;
    }

    let compCode = '';

    str = str.replace(/[(){}\[\]<>:]/g, function(str){
      if(str === '('){
        return '(0)';
      }else if(str === ')'){
        return '(1)';
      }else if(str === '{'){
        return '(2)';
      }else if(str === '}'){
        return '(3)';
      }else if(str === '['){
        return '(4)';
      }else if(str === ']'){
        return '(5)';
      }else if(str === '<'){
        return '(6)';
      }else if(str === '>'){
        return '(7)';
      }else if(str === ':'){
        return '(8)';
      }
      return str;
    });

    str = referenceCommonWords(str);

    // method 1
    for(let i = 0; i < level; i++){
      let c = str.replace(/(.)\1{2,11}/gs, function(str, c){
        return (str.length-3).toString()+':'+c;
      });
      if(c.length >= str.length){
        compCode += i.toString();
        break;
      }else if(i === level-1){
        compCode += (i+1).toString();
        str = c;
        break;
      }else{
        str = c;
      }
    }
    if(compCode === ''){
      compCode = '0';
    }

    let s = str;

    // method 2
    let cCode = '';
    for(let i = 0; i < level; i++){
      let c = s.replace(/(.+?)\1(\1|)(\1|)(\1|)(\1|)(\1|)(\1|)(\1|)(\1|)(\1|)/gs, function(str, c, r1, r2, r3, r4, r5, r6, r7, r8, r9){
        let l = 0;
        if(r9 !== ''){l = 9;}
        else if(r8 !== ''){l = 8;}
        else if(r7 !== ''){l = 7;}
        else if(r6 !== ''){l = 6;}
        else if(r5 !== ''){l = 5;}
        else if(r4 !== ''){l = 4;}
        else if(r3 !== ''){l = 3;}
        else if(r2 !== ''){l = 2;}
        else if(r1 !== ''){l = 1;}
        let ind = (i+1).toString();
        return '{'+ind+l.toString()+c+ind+'}';
      });
      if(c.length >= s.length){
        cCode += i.toString();
        break;
      }else if(i === level-1){
        cCode += (i+1).toString();
        s = c;
        break;
      }else{
        s = c;
      }
    }

    if(s.length < str.length){
      compCode += cCode;
      str = s;
    }else{
      compCode += '0';
    }

    // method 3
    let p = [];
    function findRepeats(s, repeatLevel = 0){
      if(repeatLevel > level){
        return s;
      }
      return s.replace(/(.+)(.*?)\1/gs, function(str, pattern, between){
        let i = letterOfIndex(p.length);
        if(i === NaN){return str;}
        let l = '['+i+']';
        p.push(pattern);
        return l+findRepeats(between, repeatLevel+1)+l;
      });
    }
    s = findRepeats(s);
    s = JSON.stringify(p)+s;

    if(s.length < str.length){
      compCode += '1';
      str = s;
    }else{
      compCode += '0';
    }

    compCode = compCode.replace(/0?0$/, '');

    return compCode+'>'+str;
  }

  decomp[1] = function(str){
    let compCode = '';
    str = str.replace(/^([0-9]{1,3})>/, function(str, num){
      compCode = num.toString();
      while(compCode.length < 3){
        compCode += '0';
      }
      return '';
    });

    // method 3
    if(compCode[2] === '1'){
      let p = [];
      str = str.replace(/^\[.*?\]/, function(str){
        try{
          p = JSON.parse(str);
        }catch(e){}
        return '';
      });

      str = str.replace(/\[(.*?)\]/gs, function(str, ind){
        let num = indexOfLetter(ind);
        if(num === -1){return str;}
        return p[num];
      });

    }

    // method 2
    if(compCode[1] !== '0'){
      let loops = Number(compCode[1]);
      for(let i = loops; i > 0; i--){
        str = str.replace(new RegExp('\\{'+i+'([0-9])(.*?)'+i+'\\}', 'gs'), function(str, r, s){
          return s.repeat(Number(r)+2);
        });
      }
    }

    // method 1
    if(compCode[0] !== '0'){
      let loops = Number(compCode[0]);
      for(let i = loops; i > 0; i--){
        str = str.replace(/([0-9]):(.)/gs, function(str, n, s){
          return s.repeat(Number(n)+3);
        });
      }
    }

    str = dereferenceCommonWords(str);

    str = str.replace(/\(([0-8])\)/g, function(str, num){
      num = Number(num);
      if(num === 0){
        return '(';
      }else if(num === 1){
        return ')';
      }else if(num === 2){
        return '{';
      }else if(num === 3){
        return '}';
      }else if(num === 4){
        return '[';
      }else if(num === 5){
        return ']';
      }else if(num === 6){
        return '<';
      }else if(num === 7){
        return '>';
      }else if(num === 8){
        return ':';
      }
      return str;
    });

    return str;
  }


  function compress(str, level = 9){
    if(typeof str === 'object'){
      str = JSON.stringify(str);
    }

    let ver = 0;
    for(let i = comp.length; i > 0; i--){
      if(typeof comp[i] === 'function'){
        let c = comp[i](str, level);
        if(c.length <= str.length){
          str = c;
          ver = i;
          break;
        }
      }
    }

    let compVer = 0;
    for(let i = standardComp.length; i > 0; i--){
      if(typeof standardComp[i] === 'object'){
        try{
          let c = standardComp[i].comp(str, level);
          if(c.length <= str.length){
            str = c;
            compVer = i;
            break;
          }
        }catch(e){}
      }
    }

    return {
      comp: str.toString('utf-8'),
      ver: ver,
      compType: compVer,
      toString: function(){
        if(this.compType !== 0){
          return '§'+this.ver+':'+this.compType+':'+this.comp;
        }
        return '§'+this.ver+':'+this.comp;
      },
      toJSON: function(){
        return {
          comp: this.comp,
          ver: this.ver,
          compType: this.compType,
        }
      },
      decomp: function(){
        return decompress(this);
      },
    };
  }

  function decompress(str){
    let ver = 0, compVer = 0;

    if(typeof str === 'object'){
      ver = str.ver;
      compVer = str.compType;
      str = str.comp;
    }else{
      str = str.toString();
      if(!str.match(/^§[0-9]+:/)){
        return undefined;
      }

      str = str.replace(/^§([0-9]+):(?:([0-9]+):|)/, function(str, n1, n2){
        ver = Number(n1);
        if(n2){compVer = Number(n2);}
        return '';
      });
    }

    if(typeof standardComp[compVer] === 'object'){
      try{
        str = standardComp[compVer].decomp(str);
      }catch(e){}
    }

    if(typeof decomp[ver] === 'function'){
      str = decomp[ver](str);
    }

    return str;
  }


  function referenceCommonWords(str){
    for(let i = 0; i < commonWords.length; i++){
      str = str.replace(new RegExp('<?'+escapeRegExp(commonWords[i])+'>?', 'gs'), function(str){
        if(str.startsWith('<') || str.endsWith('>')){
          return str;
        }
        return '<'+letterOfIndex(i)+'>';
      });
    }
    return str;
  }

  function dereferenceCommonWords(str){
    str = str.replace(/<(.*?)>/gs, function(str, ind){
      let num = indexOfLetter(ind);
      return commonWords[num];
    });
    return str;
  }

  
  function letterOfIndex(index){
    if(index < letterIndexes.length){
      return letterIndexes[index];
    }

    let len = 0;
    index -= letterIndexes.length;
    if(index < letterIndexes.length){
      return letterIndexes[0]+letterIndexes[index];
    }

    while(index >= letterIndexes.length){
      len++;
      index -= letterIndexes.length;
    }

    return letterOfIndex(len)+letterIndexes[index];
  }

  function indexOfLetter(letter){
    let index = 0;
    for(let i = 0; i < letter.length; i++){
      let ind = letterIndexes.indexOf(letter[i]);
      if(ind === -1){
        return -1;
      }
      index *= letterIndexes.length;
      index += ind+1;
    }
    return index-1;
  }


  function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\~`!@#]/g, '\\$&');
  }

  function jsRequire(nodePath, cdnName, callback){
    if(callback === undefined && typeof cdnName === 'function'){
      callback = cdnName;
      cdnName = undefined;
    }

    if(typeof module === 'object' && typeof require === 'function'){
      let mod = undefined;

      try{
        mod = require(nodePath);
      }catch(e){}

      if(mod && typeof callback === 'function'){
        return callback(mod);
      }

      return mod;
    }else{
      let mod = undefined;
      if(typeof window === 'object'){
        mod = window[cdnName || nodePath];
      }else if(typeof global === 'object'){
        mod = global[cdnName || nodePath];
      }

      if(mod && typeof callback === 'function'){
        return callback(mod);
      }

      return mod;
    }
  }


  return {
    compress,
    decompress,
  };
})();

if(typeof module === 'object'){
  // add node.js compatibility
  module.exports = cwscLib;
}
