
const StreamHelper = require("../models/streamHelper");

/**
 *
 * @param questionnaire
 * @returns {{question: *, success: *, answers: *, message: *}}
 */
function returnFirstQuestion(questionnaire) {
    let success = true;
    let msg = '';

    //check if questionnaire is ok

    const firstQuestion = questionnaire.questionList.all()[0];
    let fqAnswers = questionnaire.answerList.find(firstQuestion.answers);

    // Set the default scene
    try {
        success = StreamHelper.changeScene('default')
    } catch (e) {
        console.error(e);
        success = false;
        msg = e.description;
    }

    // Now start the stream
    StreamHelper.startStreaming();

    return {
        success: success,
        message: msg,
        question: firstQuestion,
        answers: fqAnswers
    };
}

/**
 *
 *
 * @param req
 * @param res
 */
exports.getQuestion = function (req, res) {
    res.json(returnFirstQuestion(req.app.get('questionnaire')));
};

/**
 *
 * @param req
 * @param res
 */
exports.sendAnswer = function (req, res) {
    /** @type {Questionnaire} */
    let questionnaire = req.app.get('questionnaire');
    let rawAnswerId = req.body.answer;
    let success = true;
    let msg = '';

    if (typeof rawAnswerId === 'undefined') {
        res.json(returnFirstQuestion(questionnaire));
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
        console.warn(msg);
        nextQuestion = null;
        success = false;
    } else {
        // TODO: Find nice fix for this
        nextQuestion = nextQuestion[0];

        msg = 'Multiple questions found. Currently picking only the first one.';
        console.warn(msg);
    }


    // Get the best tag
    // TODO: optimize this part so we can change scenes more often
    // TODO: We want to change scenes every X seconds, based on the most popular tags available (not only the best one)
    // let bestTag = questionnaire.tagList.getBestTag();

    let found = false;

    try {
        found = StreamHelper.changeScene(tag);
    } catch (e) {
        console.error(e);
        success = false;
        msg = e.description;
    }

    if (!found) {
        msg = 'No suitable scene found for tag ' + tag;
        console.log("\x1b[31m%s\x1b[0m", msg); //in red
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