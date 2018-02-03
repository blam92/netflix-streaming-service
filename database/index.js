const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'hello' });
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient();

const plays = require('./plays');
const streaming = require('./streaming');
const cacheLib = require('./redis');

redisClient.on('error', (err) => {
  console.log('Redis Error: ', err);
});

let postPlayRequest = (contentId, userId) => {
  return streaming.getFirstChunk(client, contentId, redisClient)
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
  return cacheLib.getCachedChunkById(redisClient, chunkId)
  .then((cachedObj) => {
    if(cachedObj.err) {
      // console.log('NO CACHE. SEARCHING DB...');
      return streaming.getChunkById(client, chunkId)
      .then((result) => {
        if(result.err) return result;
        let secondsToUpdate = result.chunk.start;
        cacheLib.cacheChunkById(redisClient, chunkId, result.chunk);
        cacheLib.cacheSecondsWatched(redisClient, playId, secondsToUpdate);
        return result;
      })
      .catch((err) => err);
    } else {
      // console.log('HIT CACHE!!!');
      let secondsToUpdate = cachedObj.chunk.start;
      cacheLib.cacheSecondsWatched(redisClient, playId, secondsToUpdate);
      return cachedObj;
    }
  });
}

let getChunksBySeconds = (contentId, secondMark, playId) => {
  return streaming.getChunkBySeconds(client, contentId, secondMark)
  .then((result) => {
    if(result.err) return result;
    let secondsToUpdate = result.start;
    return result;
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

let getPlaysFromUser = (userId) => {
  return plays.getPlaysFromUser(client, userId)
  .then((result) => {
    return result;
  })
  .catch((err) => err);
}

let userClosesPlayer = (playId) => {
  return cacheLib.getCachedSecondsWatched(redisClient, playId)
  .then((redisRes) => {
    return redisRes;
  })
  .then((secondsToUpdate) => {
    console.log('index', secondsToUpdate);
    return plays.updateMinutesWatchedOnPlay(client, playId, secondsToUpdate)
    .then((status) => {
      if(status.ok) {
        return {updated: true}
      }
    })
    .catch((err) => err);
  })
}

module.exports = {
  postPlayRequest: postPlayRequest,
  getChunkById: getChunkById,
  getChunkBySeconds: getChunksBySeconds,
  finishPlay: finishPlay,
  getPlaysFromUser: getPlaysFromUser,
  userClosesPlayer: userClosesPlayer
}