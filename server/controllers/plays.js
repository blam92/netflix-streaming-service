let db = require('../../database/index');
let postPlays = (req, res) => {
  let userId = req.body.userId;
  let contentId = req.body.contentId;
  if(!userId || !contentId) {
    res.status(500).json({err: 'Missing contentId or userId'});
  }
  return db.postPlayRequest(contentId, userId)
  .then((results) => {
    if(results.err) return res.status(500).json(results);
    res.json(results);
  })
  .catch((err) => err);
}

let patchPlaysWithEndDate = (req, res) => {
  let playId = req.body.playId;

  if(!playId) {
    res.status(500).json({err: 'Missing playId'});
  }

  return db.finishPlay(playId)
  .then((results) => {
    if(results.err) return res.status(500).json(results);
    res.json(results);
  });
}

let getUnfinishedPlays = (req, res) => {
  let userId = req.query.userId;

  if(!userId) {
    res.status(500).json({err: 'Missing userId'});
  }

  return db.getPlaysFromUser(userId)
  .then((results) => {
    if(!Array.isArray(results)) {
      return res.status(500).json({err: 'user not found'});
    }
    let unfinishedResults = results.filter((val) => {
      return val.enddate === null;
    });
    res.json(unfinishedResults);
  })
  .catch((err) => err);
};

let patchSecondsWatched = (req, res) => {
  let playId = req.query.playId;
  if(!playId) {
    res.status(500).json({err: 'Missing playId'});
  }

  return db.userClosesPlayer(playId)
  .then((result) => {
    res.json(result);
  });
}

module.exports = {
  postPlays: postPlays,
  patchPlaysWithEndDate: patchPlaysWithEndDate,
  getUnfinishedPlays: getUnfinishedPlays,
  patchSecondsWatched: patchSecondsWatched
}