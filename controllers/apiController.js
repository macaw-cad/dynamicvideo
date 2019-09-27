/**
 *
 * @type {Question}
 */
exports.index = function (req, res) {

    let q = req.app.questionnaire;

    // console.table(q.questionList);

    res.render('index', {title: 'Livestream'})
};

exports.getQuestion = function (req, res) {
    // security check:
    // is it xhr? is it from same user?

    // Return the question in JSON to the client
    res.json(req.app.get('questionnaire').questionList[0]);
};

/**
 *
 * @param req
 * @param res
 */
exports.sendAnswer = function (req, res) {

    // Get OBS and Scenelist
    let obs = req.app.get('obs');
    let sceneList = req.app.get('sceneList');
    /** @type {Questionnaire} */
    let questionnaire = req.app.get('questionnaire');
    let rawAnswerId = req.body.answer;


    // TODO: check if obs/scenelist is set (correct)
    // TODO: check if answer is given, otherwise give user (browser) feedback
    const answerId = parseInt(rawAnswerId);

    // Get the next question based on the given answer
    // const nextQuestion = questionnaire.processAnswer(answerId);

    // Get the best tag
    // TODO: optimize this part so we can change scenes more often
    // TODO: We want to change scenes every X seconds, based on the most popular tags available (not only the best one)
    let bestTag = questionnaire.tagList.getBestTag();


    let found = false;
    // Change current scene
    // for (let s in sceneList) {
    //     // Check if the tag meets the scene from the scenelist
    //     if (sceneList[s] === bestTag) {
    //         obs.send('SetCurrentScene', {
    //             'scene-name': sceneList[s]
    //         });
    //         found = true;
    //         break;
    //     }
    // }

    if (!found) {
        console.log("\x1b[31m%s\x1b[0m", 'No suitable scene found')
    }

    console.table(bestTag);
    let nextQuestion = questionnaire.questionList.findByBasedOn(bestTag.title);

    res.json(nextQuestion);

    // return with new question, based on the answer from the client
};