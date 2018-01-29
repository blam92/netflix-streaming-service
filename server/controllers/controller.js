const plays = require('./plays');

module.exports = {
  postPlays: plays.postPlays,
  patchPlays: (req, res) => {
    res.json('patch Plays');
  },
  getChunk: (req, res) => {
    res.json({id: parseInt(req.params.chunkId), chunk: {}});
  },
  getUnfinished: (req, res) => {
    res.json({
      results: [{uid: parseInt(req.query.userId), endDate: null}]
    });
  }
}