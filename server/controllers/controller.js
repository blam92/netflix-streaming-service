const plays = require('./plays');
const chunks = require('./chunks');

module.exports = {
  postPlays: plays.postPlays,
  patchPlays: (req, res) => {
    res.json('patch Plays');
  },
  getChunk: chunks.getChunkById,
  getUnfinished: (req, res) => {
    res.json({
      results: [{uid: parseInt(req.query.userId), endDate: null}]
    });
  }
}