/**
 *
 * @param req
 * @param res
 */
const Question = require("../models/question");

/**
 *
 *
 * @param req
 * @param res
 */
exports.getQuestion = function (req, res) {
    // Get the global OBS and Scenelist instances
    let obs = req.app.get('obs');
    let questionnaire = req.app.get('questionnaire');
    let success = true;
    let msg = '';

    const firstQuestion = questionnaire.questionList.all()[0];
    let fqAnswers = questionnaire.answerList.find(firstQuestion.answers);

    // Set the default scene
    obs.send('SetCurrentScene', {
        'scene-name': 'default'
    }).catch(function (e) {
        console.error(e);
        success = false;
        msg = e.description;
    });

    res.json({
        success: success,
        message: msg,
        question: firstQuestion,
        answers: fqAnswers
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.sendAnswer = function (req, res) {

    // Get the global OBS and Scenelist instances
    let obs = req.app.get('obs');
    let sceneList = req.app.get('sceneList');
    /** @type {Questionnaire} */
    let questionnaire = req.app.get('questionnaire');
    let rawAnswerId = req.body.answer;

    // TODO FIX! This code is also in getQuestion api
    if (typeof rawAnswerId === 'undefined') {
        // Get first question from list
        let firstQuestion = questionnaire.questionList.all()[0];
        let fqAnswers = questionnaire.answerList.find(firstQuestion.answers);

        // Set the default scene
        obs.send('SetCurrentScene', {
            'scene-name': 'default'
        }).catch(function (e) {
            console.error(e);
        });

        res.json(
            {
                question: firstQuestion,
                answers: fqAnswers
            }
        );
        return;
    }

    // TODO: check if obs/scenelist is set (correct)
    // TODO: check if answer is given, otherwise give user (browser) feedback
    const answerId = parseInt(rawAnswerId);

    // Get the next question based on the given answer
    // questionnaire.processAnswer(answerId);
    const answer = questionnaire.answerList.find(answerId);
    const tag = answer.tags[0];

    let nextQuestion = questionnaire.questionList.findByBasedOn(tag);

    if (Array.isArray(nextQuestion) && nextQuestion.length === 1) {
        nextQuestion = nextQuestion[0];
    } else {
        // TODO: Find nice fix for this
        nextQuestion = nextQuestion[0];
        console.warn('Multiple questions found. Currently picking only the first one.')
    }

    let nqAnswers = null;
    if (nextQuestion) {
        nqAnswers = questionnaire.answerList.find(nextQuestion.answers);
    } else {
        console.warn('No question found');
    }


    // Get the best tag
    // TODO: optimize this part so we can change scenes more often
    // TODO: We want to change scenes every X seconds, based on the most popular tags available (not only the best one)
    // let bestTag = questionnaire.tagList.getBestTag();

    let found = false;
    // Change current scene
    for (let s in sceneList) {
        // Check if the tag meets the scene from the scenelist
        if (sceneList[s] === tag) {
            obs.send('SetCurrentScene', {
                'scene-name': sceneList[s]
            }).catch(function (e) {
                console.error(e);
            });
            found = true;
            break;
        }
    }

    if (!found) {
        console.log("\x1b[31m%s\x1b[0m", 'No suitable scene found for tag ' + tag)
    }

    // return with new question, based on the answer from the client
    res.json(
        {
            question: nextQuestion,
            answers: nqAnswers
        }
    );
};