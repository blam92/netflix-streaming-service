let db = require('../../database/index');

let getChunksById = (req, res) => {
  const chunkId = req.params.chunkId;
  if(!chunkId) {
    res.status(500).json({err: 'No parameter found. Please send a valid id'});
  }
  db.getChunkById(parseInt(chunkId))
  .then((chunk) => {
    if(chunk.err) return res.status(500).json(chunk);

    res.json(chunk);
  });
}

module.exports = {
  getChunkById: getChunksById
}