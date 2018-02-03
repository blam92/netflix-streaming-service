let cacheChunkById = (redisClient, chunkId, chunk) => {

  redisClient.hmsetAsync(`chunk:${chunkId}`, 'streamingData', chunk.streamingdata, 'start', chunk.start, 'end', chunk.end, 'nextchunk', chunk.nextchunk || '')
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
    obj.nextchunk = parseInt(obj.nextchunk) || null;
    return {
      id: chunkId,
      chunk: obj
    };
  })
  .catch((err) => err);
}

let cacheSecondsWatched = (redisClient, playId, secondsToUpdate) => {
  return redisClient.hmsetAsync(`play:${playId}`, 'secondsWatched', secondsToUpdate)
  .catch((err) => console.log('err', playId, err));
}

let getCachedSecondsWatched = (redisClient, playId) => {
  return redisClient.hgetAsync(`play:${playId}`, 'secondsWatched')
  .then((res) => {
    if(!res) {
      return {err: true}
    }
    res.secondsWatched = parseInt(res.secondsWatched);
    return res;
  });
}

module.exports = {
  cacheChunkById: cacheChunkById,
  cacheListOfChunks: cacheListOfChunks,
  getCachedChunkById: getCachedChunkById,
  cacheSecondsWatched: cacheSecondsWatched,
  getCachedSecondsWatched: getCachedSecondsWatched
}