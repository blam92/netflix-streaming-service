const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: [process.env.CASS_IP || '127.0.0.1'], keyspace: process.env.CASS_KS || 'hello'});
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient(process.env.REDIS_PORT || 6379, process.env.REDIS_IP || '127.0.0.1');
let inMemoryObj = require('./in_memory_obj');

const plays = require('./plays');
const streaming = require('./streaming');
const cacheLib = require('./redis');

redisClient.on('error', (err) => {
  console.log('Redis Error: ', err);
});
redisClient.info((err, reply) => {
  console.log('INFO', reply);
});

client.execute('SELECT * FROM test').then((res) => {
  console.log(res.rows);
});
redisClient.set('test', 'true');
redisClient.get('test', (err, reply) => {
  console.log(reply);
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
  let inMemoryChunk = inMemoryObj.chunks[chunkId];
  if(inMemoryChunk) {
    return new Promise((resolve, reject) => {
      resolve(inMemoryChunk);
    });
  }
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
        inMemoryObj.chunks[chunkId] = result;
        return result;
      })
      .catch((err) => err);
    } else {
      // console.log('HIT CACHE!!!');
      let secondsToUpdate = cachedObj.chunk.start;
      cacheLib.cacheSecondsWatched(redisClient, playId, secondsToUpdate);
      inMemoryObj.chunks[chunkId] = cachedObj;
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