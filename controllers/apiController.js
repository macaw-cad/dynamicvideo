/**
 * The API controller
 *
 * This controller handles the XHR requests
 */
const StreamHelper = require("../helpers/streamHelper");
const Logger = require('../helpers/logger');

class ApiController {

    /**
     *
     * @param questionnaire
     * @returns {{question: *, success: *, answers: *, message: *}}
     */
    _returnFirstQuestion(questionnaire, sessionId) {
        let success = null;
        let startedStream = false;
        let msg = '';

        //Get question and answers
        const firstQuestion = questionnaire.questionList.all()[0];
        const fqAnswers = questionnaire.answerList.find(firstQuestion.answers);

        const sh = new StreamHelper();

        // Set the default scene
        try {
            success = sh.changeScene('default', sessionId);
        } catch (e) {
            Logger.error('Error while setting the default scene:' + e);
            success = false;
            msg = e.toString();
        }

        if (success) {
            try {
                // Now start the stream
                sh.startStreaming(sessionId);
                startedStream = true;
            } catch (e) {

            }
        }

        return {
            success: success,
            message: msg,
            question: firstQuestion,
            answers: fqAnswers,
            started_stream: startedStream
        };
    }

    /**
     *
     *
     * @param req
     * @param res
     */
    getQuestion(req, res) {
        Logger.log(this);

        res.json(this._returnFirstQuestion(req.app.get('questionnaire'), req.session.id));
    };

    /**
     *
     * @param req
     * @param res
     */


    sendAnswer(req, res) {
        /** @type {Questionnaire} */
        let questionnaire = req.app.get('questionnaire');
        let rawAnswerId = req.body.answer;
        let success = true;
        let newVideo = false;
        let msg = '';
        const sh = new StreamHelper();

        if (typeof rawAnswerId === 'undefined') {
            res.json(this._returnFirstQuestion(questionnaire, req.session.id));
            return;
        }

        // TODO: check if stream/scenelist is set (correct)
        // TODO: check if answer is given, otherwise give user (browser) feedback
        const answerId = parseInt(rawAnswerId);

        // Get the next question based on the given answer
        // questionnaire.processAnswer(answerId);
        const answer = questionnaire.answerList.find(answerId);
        const tag = answer.tags[0];

        let nextQuestion = questionnaire.questionList.findByBasedOn(tag);
        let nqAnswers = null;

        if (Array.isArray(nextQuestion) && nextQuestion.length === 1) {
            nextQuestion = nextQuestion[0];
            nqAnswers = questionnaire.answerList.find(nextQuestion.answers);
        } else if (nextQuestion.length === 0) {

            // TODO Find a nice fix for this
            msg = 'No question found';
            Logger.warn(msg);
            nextQuestion = null;
            success = false;
        } else {
            // TODO: Find nice fix for this
            nextQuestion = nextQuestion[0];

            msg = 'Multiple questions found. Currently picking only the first one.';
            Logger.warn(msg);
        }


        // Get the best tag
        // TODO: optimize this part so we can change scenes more often
        // TODO: We want to change scenes every X seconds, based on the most popular tags available (not only the best one)
        // let bestTag = questionnaire.tagList.getBestTag();


        try {
            newVideo = sh.changeScene(tag, req.session.id);
        } catch (e) {
            Logger.error(e);
            newVideo = false;
            msg = e.description;
        }

        // return with new question, based on the answer from the client
        res.json(
            {
                new_video: newVideo,
                success: success,
                message: msg,
                question: nextQuestion,
                answers: nqAnswers
            }
        );
    };
}

module.exports = ApiController;