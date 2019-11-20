/**
 * The Index controller
 *
 * This controller handles the index page
 */


const Logger = require('../helpers/logger');


class IndexController {
    index(req, res) {
        Logger.log('Session ID: ' + req.session.id);
        res.render('index', {title: 'Livestream'});
    };

    //set session
}

module.exports = IndexController;