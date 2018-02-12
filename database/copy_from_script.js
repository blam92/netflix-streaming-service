let fs = require('fs');

let counter = 0;
let streamingData = 'asbakdjghsa3248mja9794k';
let start = 0;
let end = 60;
let NUMBER_OF_CHUNKS_PER_MANIFEST = parseInt(process.argv[3]) || 10;
let NUMBER_OF_MANIFESTS = parseInt(process.argv[2]) || 10;
let chunks = [];
for(var i = 0; i < NUMBER_OF_MANIFESTS; i++) {
  for(let j = 0; j <= NUMBER_OF_CHUNKS_PER_MANIFEST; j++) {
    let nextChunk = counter + 1;
    if(j === NUMBER_OF_CHUNKS_PER_MANIFEST) {
      nextChunk = '';
    }
    //uncomment to create chunks
    // fs.appendFileSync('chunks.txt', `${counter}|{streamingdata: '${streamingData}', start: ${start}, end: ${end}, nextchunk: ${nextChunk}}\n`);
    chunks.push({
        streamingdata: streamingData,
        start: start,
        end: end,
        nextchunk: nextChunk
      });
    counter++;
    start += 60;
    end += 60;
  }
  let chunkString = JSON.stringify(chunks).replace(/"/g, "'");
  fs.appendFileSync('./manifest/m1.txt', `${i}|${chunkString}\n`);
  chunks = [];
  start = 0;
  end = 60;
}