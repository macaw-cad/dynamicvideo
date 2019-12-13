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
     * @param sessionId
     * @param questionnaire
     * @returns {{question: *, answers: unknown[] | *, video_id: *}}
     * @private
     */
    _returnFirstQuestion(sessionId, questionnaire) {

        // Get question and answers
        const firstQuestion = questionnaire.getNextQuestion();
        firstQuestion.asked = true;

        const fqAnswers = questionnaire.answerList.find(firstQuestion.answers);

        return {
            question: firstQuestion,
            answers: fqAnswers,
            video_id: sessionId
        };
    }

    /**
     * Start the video stream with the default video
     *
     * @param sessionId The session ID
     * @param questionnaire
     * @returns {{success: boolean, started_stream: boolean, message: string}}
     * @private
     */
    _startStream(sessionId, questionnaire) {
        const sh = new StreamHelper();

        let success = false;
        let startedStream = false;
        let msg = '';

        try {
            // Now start the stream
            sh.startStreaming(sessionId, questionnaire);
            startedStream = true;
            success = true;
        } catch (e) {
            msg = e;
        }

        return {
            success: success,
            message: msg,
            started_stream: startedStream
        };

    }

    /**
     * Init the video stream and return the first question with answers
     *
     * @param req The request body
     * @param res The response
     */
    init(req, res) {
        const sessionId = req.session.id;
        let questionnaire = req.app.get('questionnaire_' + sessionId);

        res.json(
            {
                ...this._returnFirstQuestion(sessionId, questionnaire),
                ...this._startStream(sessionId, questionnaire)
            }
        );
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
        let msg = '';
        const sh = new StreamHelper();

        if (typeof rawAnswerId === 'undefined') {
            res.json({
                success: false,
                message: 'No answer ID given'
            });
            return;
        }

        // Process the given answer in the questionnaire
        const answerId = parseInt(rawAnswerId);
        questionnaire.processAnswer(answerId);

        // Get the next questions and corresponding answers
        let nextQuestion = questionnaire.getNextQuestion();
        let nqAnswers = null;

        // Get the answers
        if (!(nextQuestion === null || typeof nextQuestion === 'undefined')) {
            nqAnswers = questionnaire.answerList.find(nextQuestion.answers);
            nextQuestion.asked = true;

            if (nqAnswers === null) {
                success = false;
                msg = 'No answers found'
            }
        } else {
            msg = 'We think we have a pretty accurate view of your interests. Enjoy!';
            nextQuestion = null;
        }

        // return with new question, based on the answer from the client
        res.json(
            {
                success: success,
                message: msg,
                question: nextQuestion,
                answers: nqAnswers
            }
        );
    };
}

module.exports = ApiController;