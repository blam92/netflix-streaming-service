let fs = require('fs');

let counter = 0;
let streamingData = 'asbakdjghsa3248mja9794k';
let start = 0;
let end = 60;
const NUMBER_OF_CHUNKS_PER_MANIFEST = 100;
//remember to update start and end as they are in SECONDS!!
for(var i = 0; i < 100000; i++) {
  fs.appendFileSync('data.cql', `INSERT INTO manifest (contentId, chunks) VALUES (${i}, []);\n`);
  for(let j = 0; j <= NUMBER_OF_CHUNKS_PER_MANIFEST; j++) {
    let nextChunk = counter + 1;
    if(j === NUMBER_OF_CHUNKS_PER_MANIFEST) {
      nextChunk = null;
    }
    fs.appendFileSync('data.cql', `UPDATE manifest SET chunks = chunks + [{streamingData: '${streamingData}', start: ${start}, end: ${end}, nextChunk: ${nextChunk}}] WHERE contentId=${i};\n`);
    counter++;
    start += 60;
    end += 60;
  }
  start = 0;
  end = 60;
}