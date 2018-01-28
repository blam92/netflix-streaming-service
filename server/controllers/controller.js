module.exports = {
  postPlays: (req, res) => {
    res.json({
      streamingData: 'asfnasg',
      start: 0,
      end: 1,
      nextChunk: 123
    });
  },
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