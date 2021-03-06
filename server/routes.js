var router = require('express').Router();
var controller = require('./controllers/controller');

router.post('/plays', controller.postPlays);
router.patch('/plays', controller.patchPlays);
router.patch('/close', controller.patchSecondsWatched);
router.get('/chunks/:chunkId', controller.getChunk);
router.get('/unfinished', controller.getUnfinished);

module.exports = router;