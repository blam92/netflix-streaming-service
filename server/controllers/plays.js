let db = require('../../database/index');
let postPlays = (req, res) => {
  let userId = req.body.userId;
  let contentId = req.body.contentId;
  if(!userId || !contentId) {
    res.status(500).json({err: 'Missing contentId or userId'});
  }
  return db.postPlayRequest(contentId, userId)
  .then((results) => {
    if(results.err) {
      res.status(500).json(results);
    }
    res.json(results);
  })
  .catch((err) => err);
}

module.exports = {
  postPlays: postPlays
}