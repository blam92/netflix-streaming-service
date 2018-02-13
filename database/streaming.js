const CHUNK_SIZE = 60;
const cacheLib = require('./redis');

let getManifest = (client, contentId) => {
  const query = 'SELECT * FROM manifest WHERE contentId = ?';
  return client.execute(query, [contentId], {prepare : true})
  .then(result => result.rows)
  .catch((err) => err);
}

let contentCheck = (result) => {
  if(!result[0]) {
    return {err: 'content not found'}
  } else {
    return {ok: true}
  }
}

let getChunkIndexBasedOnSeconds = (seconds) => {
  return Math.floor(seconds/CHUNK_SIZE);
}

let getFirstChunk = (client, contentId, redisClient) => {
  return getManifest(client, contentId)
    .then((result) => {
      let status = contentCheck(result);
      if(status.err) {
        return status;
      }
      cacheLib.cacheListOfChunks(redisClient, result[0].chunks);
      return result[0].chunks[0];
    })
    .catch((err) => {
      return err;
    });
}

let getChunkById = (client, chunkId) => {
  const query = 'SELECT * FROM chunks WHERE id = ?'
  return client.execute(query, [chunkId], {prepare: true})
  .then(result => {
    let status = contentCheck(result.rows);
    if(status.err) {
      return status;
    }
    return result.rows[0];
  })
  .catch((err) => {
    return {err: err};
  });
}

let getChunkBySeconds = (client, contentId, secondMark) => {
  return getManifest(client, contentId)
  .then((result) => {
    let status = contentCheck(result);
    if(status.err) {
      return status;
    }
    const index = getChunkIndexBasedOnSeconds(secondMark);
    return result[0].chunks[index];
  });
}

module.exports = {
  getFirstChunk: getFirstChunk,
  getChunkById: getChunkById,
  getChunkBySeconds: getChunkBySeconds
}