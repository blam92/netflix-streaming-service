let db = require('../../database/index');

let getChunks = (req, res) => {
  const chunkId = req.params.chunkId;
  const playId = req.query.playId;
  const type = req.query.type;
  const contentId = req.query.contentId;
  const seconds = req.query.start || 0;
  if(!playId) {
    res.status(500).json({err: 'No parameter found. Please send a valid playId'});
  }

  if(type === 'by_seconds') {
    if(!contentId) {
      res.status(500).json({err: 'No parameter found. Please send a valid contentId when requesting by seconds'});
    } else {
      db.getChunkBySeconds(parseInt(contentId), seconds, playId)
      .then((chunk) => {
        if(chunk.err) return res.status(500).json({err: 'invalid request'});
        res.json(chunk);
      });
    }
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