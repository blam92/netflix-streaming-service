let cacheChunkById = (redisClient, chunkId, chunk) => {
  redisClient.hmsetAsync(`chunk:${chunkId}`, 'streamingData', chunk.streamingdata, 'start', chunk.start, 'end', chunk.end, 'nextchunk', chunk.nextchunk)
  .then((res) => {
    console.log('CHUNK ', chunkId, res);
  })
  .catch((err) => console.log('CHUNK ERR', chunkId, err));
}

let cacheListOfChunks = (redisClient, chunks) => {
  for(var i = 1; i < chunks.length; i++) {
    cacheChunkById(redisClient, chunks[i - 1].nextchunk, chunks[i]);
  }
}

let getCachedChunkById = (redisClient, chunkId) => {
  return redisClient.hgetallAsync(`chunk:${chunkId}`)
  .then((obj) => {
    if(!obj) {
      return {err: true}
    }
    obj.start = parseInt(obj.start);
    obj.end = parseInt(obj.end);
    obj.nextchunk = parseInt(obj.nextchunk);
    return obj;
  })
  .catch((err) => err);
}

module.exports = {
  cacheChunkById: cacheChunkById,
  cacheListOfChunks: cacheListOfChunks,
  getCachedChunkById: getCachedChunkById
}