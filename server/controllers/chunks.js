let db = require('../../database/index');

let getChunks = (req, res) => {
  const chunkId = req.params.chunkId;
  const playId = req.query.playId;
  const type = req.query.type;
  if(!playId) {
    res.status(500).json({err: 'No parameter found. Please send a valid playId'});
  }

  if(type === 'by_seconds') {
    // db.getChunkBySeconds()
  } else {
    if(!chunkId) {
      res.status(500).json({err: 'No parameter found. Please send a valid chunkId'});
    } else {
      db.getChunkById(parseInt(chunkId), playId)
      .then((chunk) => {
        if(chunk.err) return res.status(500).json({err: 'invalid chunk Id'});
        res.json(chunk);
      });
    }
  }
}

module.exports = {
  getChunks: getChunks
}