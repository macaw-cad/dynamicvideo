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
     * @param sessionId
     *
     * @returns {{question: *, success: *, answers: *, message: *}}
     */
    _returnFirstQuestion(questionnaire, sessionId) {
        let success = null;
        let startedStream = false;
        let msg = '';

        //Get question and answers
        const firstQuestion = questionnaire.getNextQuestion();

        firstQuestion.asked = true;

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
                sh.startStreaming(sessionId, questionnaire);
                startedStream = true;
            } catch (e) {

            }
        }

        return {
            success: success,
            message: msg,
            question: firstQuestion,
            answers: fqAnswers,
            started_stream: startedStream,
            video_id: sessionId
        };
    }

    /**
     *
     *
     * @param req
     * @param res
     */
    getQuestion(req, res) {
        const sessionId = req.session.id;
        let questionnaire = req.app.get('questionnaire_' + sessionId);

        res.json(this._returnFirstQuestion(questionnaire, sessionId));
    };

    /**
     *
     * @param req
     * @param res
     */


    sendAnswer(req, res) {
        /** @type {Questionnaire} */
        const sessionId = req.session.id;
        let questionnaire = req.app.get('questionnaire_' + sessionId);
        let rawAnswerId = req.body.answer;
        let success = true;
        let newVideo = false;
        let msg = '';
        const sh = new StreamHelper();

        if (typeof rawAnswerId === 'undefined') {
            // TODO: Answer id is undefined, maybe something went wrong?

            res.json(this._returnFirstQuestion(questionnaire, sessionId));
            return;
        }

        // TODO: check if stream/scenelist is set (correct)
        // TODO: check if answer is given, otherwise give user (browser) feedback
        const answerId = parseInt(rawAnswerId);
        const answer = questionnaire.answerList.find(answerId);

        // Process the given answer in the questionnaire
        questionnaire.processAnswer(answer);

        let nextQuestion = questionnaire.getNextQuestion();
        let nqAnswers = null;

        // Get the answers
        if (!(nextQuestion === null || typeof nextQuestion === 'undefined')) {
            nqAnswers = questionnaire.answerList.find(nextQuestion.answers);
            nextQuestion.asked = true;
        } else {

            // TODO Find a nice solution for this
            msg = 'We think we have a pretty accurate view of your interests. Enjoy!';
            Logger.warn(msg);
            nextQuestion = null;
            success = false;
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