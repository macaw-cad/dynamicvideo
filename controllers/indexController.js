/**
 * The Index controller
 *
 * This controller handles the index page
 */


const Questionnaire = require('../models/questionnaire');
const Logger = require('../helpers/logger');


class IndexController {

    /**
     * Request for the homepage.
     * Inits the Questionnaire and renders the index page.
     *
     * @param req The request object
     * @param res The response object
     */
    index(req, res) {
        Logger.info('Session ID: ' + req.session.id);
        let oldQuestionnaire = req.app.get('questionnaire_' + req.session.id);

        Logger.table(oldQuestionnaire);
        if (typeof oldQuestionnaire !== "undefined") {
            oldQuestionnaire.refreshed = true;
        } else {
            let q = this._setQuestionnaire();
            req.app.set('questionnaire_' + req.session.id, q);
            Logger.table(q.tagList.all());
        }

        res.render('index', {title: 'Livestream'});
    };


    _setQuestionnaire() {
        // Create a global questionnaire
        let q = new Questionnaire();
        q.parseFileToJson('data/data.json');

        // Parse the JSON to objects
        q.parseJsonToQuestionList();
        q.parseJsonToAnswerList();
        q.parseJsonToTagList();
        q.parseJsonToVideoList();

        return q;
    }


}

module.exports = IndexController;