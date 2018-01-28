module.exports = {
  postPlays: (req, res) => {
    res.json('post Plays');
  },
  patchPlays: (req, res) => {
    res.json('patch Plays');
  },
  getChunk: (req, res) => {
    res.json('get chunk');
  },
  getUnfinished: (req, res) => {
    res.json('get unfinished');
  }
}