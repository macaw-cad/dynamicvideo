/**
 *
 * @type {Question}
 */
exports.index = function (req, res) {

    let q = req.app.questionnaire;

    console.table(q.questionList);

    res.render('index', {title: 'Livestream'})
};

exports.getQuestion = function (req, res) {
    // security check:
    // is it xhr? is it from same user?

    // Return the question in JSON to the client
    res.json(req.app.get('questionnaire').questionList[0]);
};

exports.sendAnswer = function (req, res) {
  // receive an answer from client


    //get the answer and send it with the function

    res.json(req.app.get('questionnaire').getCurrentQuestion());


    // return with new question, based on the answer from the client
};