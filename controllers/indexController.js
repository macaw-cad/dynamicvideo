/**
 *
 * @type {Question}
 */
var Question = require('../models/question');

exports.index = function (req, res) {
    res.render('index', {title: 'Livestream'})
};