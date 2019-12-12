var express = require('express');
var router = express.Router();

// Get controllers
var IndexController = require('../controllers/indexController');
var ApiController = require('../controllers/apiController');

let indexController = new IndexController();
let apiController = new ApiController();

/* GET home page. */
router.get('/', function (req, res) {
    indexController.index(req, res);
});

/* GET get the first question and start the stream */
router.get('/api/v1/init', function (req, res) {
    apiController.init(req, res);
});

/* POST send answer, process and change the video source */
router.post('/api/v1/send-answer', function (req, res) {
    apiController.sendAnswer(req, res);
});

module.exports = router;
