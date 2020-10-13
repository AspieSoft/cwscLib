const wordList = require('./word-lists');

const wordListKeys = Object.keys(wordList);

let maxLength = 0;
for(let i = 0; i < wordListKeys.length; i++){
  if(wordList[wordListKeys[i]].length > maxLength){
    maxLength = wordList[wordListKeys[i]].length;
  }
}

let newWordList = [];

for(let i = 0; i < maxLength; i++){
  for(let j = 0; j < wordListKeys.length; j++){
    if(i < wordList[wordListKeys[j]].length && wordList[wordListKeys[j]][i] && typeof wordList[wordListKeys[j]][i] === 'string'){
      let word = wordList[wordListKeys[j]][i];

      word = word.trim();
      word = word.replace(/[(){}\[\]<>:]/g, function(str){
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

      if(word && word !== '' && word.length >= 3 && !newWordList.includes(word)){
        newWordList.push(wordList[wordListKeys[j]][i]);
      }
    }
  }
}

newWordList = newWordList.sort((a, b) => {
  if(a.length > b.length){
    return -1;
  }else if(a.length < b.length){
    return 1;
  }
  for(let i = 0; i < Math.min(a.length, b.length); i++){
    if(a[i] > b[i]){
      return 1;
    }else if(a[i] < b[i]){
      return -1;
    }
  }
  return 0;
});

module.exports = newWordList;
