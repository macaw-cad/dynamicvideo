"use strict";

const fs = require('fs');
const Question = require('./question');
const QuestionList = require('./questionList');
const Answer = require('./answer');
const AnswerList = require('./answerList');
const Tag = require('./tag');
const TagList = require('./tagList');

class Questionnaire {


    /**
     *
     * @param json The JSON source of all the questions
     */
    constructor() {
        this._questionList = new QuestionList();
        this._answerList = new AnswerList();
        this._tagList = new TagList();
    }

    generateQuestionList(filepath) {
        let text = null;
        // Read from the file, synchronous
        try {
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
    parseJsonToQuestions() {
        const questions = this.json.questions;

        if ('undefined' !== typeof questions) {
            for (let q in questions) {
                this.questionList.addQuestion(new Question(questions[q]));
            }
        } else {
            console.error('No questions found in JSON file! TODO GOOD LOGGING');
        }
    }

    /**
     * Parse json to answers
     * @param answers in JSON format
     */
    parseJsonToAnswers() {
        const answers = this.json.answers;

        if ('undefined' !== typeof answers) {
            for (let a in answers) {
                this.answerList.addAnswer(new Answer(answers[a]));
            }
        } else {
            console.error('No answers found in JSON file! TODO GOOD LOGGING');
        }
    }

    /**
     * Parse json to tags
     * Get all the tags from the available answers
     */
    parseJsonToTags() {
        const answers = this.json.answers;


        if ('undefined' !== typeof answers) {
            let i = 0;

            for (let a in answers) {
                for (let t in answers[a].tags) {
                    if ('undefined' === typeof answers[a].tags[t]) {
                        console.error('No tags found in answer "' + answers[a].desc + '"')
                    }


                    let rawTag = {"id": i++, "title": answers[a].tags[t]}

                    this.tagList.addTag(new Tag(rawTag));
                }
            }
        } else {
            console.error('No answers found in JSON file! TODO GOOD LOGGING');
        }
    }

    /**
     * Get a question related to the given answers
     * TODO: Fix the function name
     *
     * @param answerId The ID of the given answer
     */
    processAnswer(answerId) {
        let answer = this.answerList.find(answerId);

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
                console.error(e);
            }
        } else {
            console.log('No answer given');


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
     * @returns QuestionList
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
