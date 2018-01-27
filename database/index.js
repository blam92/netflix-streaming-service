let fs = require('fs');

//INSERT INTO chunks (id, chunk) VALUES (UUID(), {streamingData: 'absdsd', start: 119, end: 120, nextChunk: NULL});
//INSERT INTO manifest (contentId, chunks) VALUES (UUID(), 2, [{streamingData: 'absdsd', start: 119, end: 120, nextChunk: NULL}]);  
let counter = 0;
let streamingData = 'asbakdjghsa3248mja9794k';
let start = 0;
let end = 1;

for(var i = 0; i < 100; i++) {
  fs.appendFileSync('data.cql', `INSERT INTO manifest (contentId, chunks) VALUES (${i}, []);\n`);
  for(let j = 0; j < 90; j++) {
    fs.appendFileSync('data.cql', `INSERT INTO chunks (id, chunk) VALUES (${counter}, {streamingData: '${streamingData}', start: ${start}, end: ${end}, nextChunk: ${counter + 1}});\nUPDATE manifest SET chunks = chunks + [{streamingData: '${streamingData}', start: ${start}, end: ${end}, nextChunk: ${counter + 1}}] WHERE contentId=${i};\n`);
    counter++;
    start++;
    end++;
  }
  start = 0;
  end = 1;
}
