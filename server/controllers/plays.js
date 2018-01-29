let db = require('../../database/index');
let postPlays = (req, res) => {
  let userId = req.body.userId;
  let contentId = req.body.contentId;
  return db.postPlayRequest(contentId, userId)
  .then((results) => {
    res.json(results);
  })
  .catch((err) => err);
}

module.exports = {
  postPlays: postPlays
}