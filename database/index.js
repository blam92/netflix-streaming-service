const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'hello' });
const plays = require('./plays');
const streaming = require('./streaming');

let postPlayRequest = (contentId, userId) => {

  return streaming.getFirstChunk(client, contentId)
  .then((chunkResponse) => {
    if(chunkResponse.err) return chunkResponse;
    
    return plays.createNewPlay(client, contentId, userId)
    .then((res) => {
      if(res.ok) {
        return chunkResponse;
      }
    });
  });
}

let updateMinutesWatched = (client, playId, secondsToUpdate) => {
  return plays.updateMinutesWatchedOnPlay(client, playId, secondsToUpdate)
  .then((status) => {
    if(status.ok) {
      return result;
    }
  })
  .catch((err) => err);
}

let getChunkById = (chunkId, playId) => {
  return streaming.getChunkById(client, chunkId)
  .then((result) => {
    if(result.err) return result;
    let secondsToUpdate = result.chunk.start;
    return plays.updateMinutesWatchedOnPlay(client, playId, secondsToUpdate)
    .then((status) => {
      if(status.ok) {
        return result;
      }
    })
    .catch((err) => err);
  })
  .catch((err) => err);
}

let getChunksBySeconds = (contentId, secondMark, playId) => {
  return streaming.getChunkBySeconds(client, contentId, secondMark)
  .then((result) => {
    if(result.err) return result;
    let secondsToUpdate = result.start;
    return plays.updateMinutesWatchedOnPlay(client, playId, secondsToUpdate)
    .then((status) => {
      if(status.ok) {
        return result;
      }
    })
    .catch((err) => err);
  })
  .catch((err) => err);
}

let finishPlay = (playId) => {
  return plays.setEndDate(client, playId)
  .then((res) => ({ok: true}))
  .catch((err) => {err: err})
}

module.exports = {
  postPlayRequest: postPlayRequest,
  getChunkById: getChunkById,
  getChunkBySeconds: getChunksBySeconds,
  finishPlay: finishPlay
}