module.exports = {
  postPlays: (req, res) => {
    console.log('post plays')
    res.json('post Plays');
  },
  patchPlays: (req, res) => {
    console.log('patch plays');
    res.json('patch Plays');
  },
  getChunk: (req, res) => {
    console.log('get chunks!');
    res.json('get chunk');
  },
  getUnfinished: (req, res) => {
    res.json('get unfinished');
  }
}