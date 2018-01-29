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

  return plays.createNewPlay(client, contentId, userId)
  .then((res) => {
    if(res.ok) {
      return streaming.getFirstChunk(client, contentId);
    }
  })
  .catch((err) => err);
}


module.exports = {
  postPlayRequest: postPlayRequest
}