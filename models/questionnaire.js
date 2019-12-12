"use strict";

const fs = require('fs');
const Question = require('./question');
const QuestionList = require('./questionList');
const Answer = require('./answer');
const AnswerList = require('./answerList');
const Tag = require('./tag');
const TagList = require('./tagList');
const Logger = require('../helpers/logger');


class Questionnaire {


    /**
     *
     */
    constructor() {
        this._questionList = new QuestionList();
        this._answerList = new AnswerList();
        this._tagList = new TagList();
    }

    /**
     * Parse a JSON file to a JSON object
     *
     * @param filepath
     */
    parseFileToJson(filepath) {
        let text = null;

        try {
            // Read from the file, synchronous
            text = fs.readFileSync(filepath, 'utf8');
        } catch (e) {
            throw Error('Couldn\'t read the file ' + filepath);
        }

        if (text) {
            try {
                this.json = JSON.parse(text);
            } catch (e) {
                throw Error('Couldn\'t parse the JSON');
            }
        }
    }

    /**
     * Parse json to questions
     */
    parseJsonToQuestionList() {
        const questions = this.json.questions;

        if ('undefined' !== typeof questions) {
            for (let q in questions) {
                this.questionList.addQuestion(new Question(questions[q]));
            }
        } else {
            Logger.error('No questions found in JSON file!');
        }
    }

    /**
     * Parse json to answers
     */
    parseJsonToAnswerList() {
        const answers = this.json.answers;

        if ('undefined' !== typeof answers) {
            for (let a in answers) {
                this.answerList.addAnswer(new Answer(answers[a]));
            }
        } else {
            Logger.error('No answers found in JSON file!');
        }
    }

    /**
     * Parse json to tags
     * Get all the tags from the available answers
     */
    parseJsonToTagList() {
        const answers = this.json.answers;


        if ('undefined' !== typeof answers) {
            let i = 0;

            for (let a in answers) {
                for (let t in answers[a].tags) {
                    if ('undefined' === typeof answers[a].tags[t]) {
                        Logger.error('No tags found in answer "' + answers[a].desc + '"')
                    }


                    let rawTag = {"id": i++, "title": answers[a].tags[t]}

                    this.tagList.addTag(new Tag(rawTag));
                }
            }
        } else {
            Logger.error('No answers found in JSON file! TODO GOOD LOGGING');
        }
    }

    /**
     * Get the next question
     *
     * @returns {null|*}
     */
    getNextQuestion() {
        // Only get the available questions
        let questions = this.questionList.getAvailableQuestions();

        if (questions === null) {
            throw new Error('All questions answered');
        }

        // If there are still no answers given
        if (this.answerList.givenAnswers.length === 0) {
            // Choose a random question to start with
            return questions[Math.floor(Math.random() * questions.length)];
        }

        //test

        return questions[Math.floor(Math.random() * questions.length)];

        // TODO: Make this better.
        // Not only searching for a basedon. Search for multiple tags oid.
        // Then we don't even need the tag parameter, but we can gather information from the taglist, which is updated by the processanswer method.
        // let q = questions.filter(q => {
        //     return (typeof q.basedOn !== 'undefined') ? q.basedOn.includes(tag) : false;
        // }) || null;

        // q.asked = true;

        // return q;
    }

    /**
     * Process the tags when a answer is given
     *
     * @param answerId The ID of the given answer
     */
    processAnswer(answerId) {
        const answer = this.answerList.find(answerId);

        if (!(answer === null || typeof answer === 'undefined')) {
            try {
                // Set the given answer to the given-answer list
                this.answerList.addGivenAnswer(answer);

                // Update tag count
                for (let id in answer.tags) {
                    let tag = this.tagList.find(answer.tags[id]);
                    tag.count++;
                }
            } catch (e) {
                // TODO: Maybe throw error forward to user in json?
                Logger.error(e);
            }
        } else {
            Logger.log('No answer given');


            return;
        }


        // Send next question


    }


    /**
     * Getters & setters
     */


    /**
     *
     * @returns AnswerList
     */
    get answerList() {
        return this._answerList;
    }

    /**
     *
     * @returns QuestionList
     */
    get questionList() {
        return this._questionList;
    }

    /**
     *
     * @returns TagList
     */
    get tagList() {
        return this._tagList;
    }

    get json() {
        return this._json;
    }

    set json(value) {
        this._json = value;
    }


}

module.exports = Questionnaire;
