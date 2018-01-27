var router = require('express').Router();
var controller = require('./controllers/controller');

router.post('/plays', controller.postPlays);
router.patch('/plays', controller.patchPlays);
router.get('/chunks', controller.getChunk);
router.get('/unfinished', controller.getUnfinished);

module.exports = router;