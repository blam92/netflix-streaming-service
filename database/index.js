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

redisClient.hmsetAsync('chunk:12', 'streamingData', 'asbakdjghsa3248mja9794k', 'start', 720, 'end', 780, 'nextchunk', 13)
.then((res) => {
  console.log('RES HMSET', res);
})
.catch((err) => console.log(err));

// redisClient.hgetall('chunk:12', (err, obj) => {
//   if(err) {
//     console.log('GET ERR', err);
//   }
//   console.log('REPLY', obj);
// });

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
  return cacheLib.getCachedChunkById(redisClient, chunkId)
  .then((cachedObj) => {
    if(cachedObj.err) {
      console.log('NO CACHE. SEARCHING DB...');
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
    } else {
      console.log('HIT CACHE!!!');
      let secondsToUpdate = cachedObj.start;
      //DUPLICATED REFACTOR!!!!!
      return plays.updateMinutesWatchedOnPlay(client, playId, secondsToUpdate)
      .then((status) => {
        if(status.ok) {
          return cachedObj;
        }
      })
      .catch((err) => err);
    }
  });
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

let getPlaysFromUser = (userId) => {
  return plays.getPlaysFromUser(client, userId)
  .then((result) => {
    return result;
  })
  .catch((err) => err);
}

module.exports = {
  postPlayRequest: postPlayRequest,
  getChunkById: getChunkById,
  getChunkBySeconds: getChunksBySeconds,
  finishPlay: finishPlay,
  getPlaysFromUser: getPlaysFromUser
}