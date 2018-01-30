const plays = require('./plays');
const chunks = require('./chunks');

module.exports = {
  postPlays: plays.postPlays,
  patchPlays: plays.patchPlaysWithEndDate,
  getChunk: chunks.getChunks,
  getUnfinished: (req, res) => {
    res.json({
      results: [{uid: parseInt(req.query.userId), endDate: null}]
    });
  }
}