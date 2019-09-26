/**
 *
 * @type {Question}
 */
var Question = require('../models/question');

exports.index = function (req, res) {
    console.log(req.app.questionnaire);
    res.render('index', {title: 'Livestream'})
};
