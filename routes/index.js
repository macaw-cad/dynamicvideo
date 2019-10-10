var express = require('express');
var router = express.Router();

// Get controllers
var indexController = require('../controllers/indexController');
var apiController = require('../controllers/apiController');

/* GET home page. */
router.get('/', indexController.index);

/* GET get the first question */
router.get('/api/v1/get-question', apiController.getQuestion);

/* POST send answer */
router.post('/api/v1/send-answer', apiController.sendAnswer);

module.exports = router;
