"use strict";

const fs = require('fs');
const Question = require('./question');
const QuestionList = require('./questionList');
const Answer = require('./answer');
const AnswerList = require('./answerList');

class Questionnaire {

    /**
     *
     * @param json The JSON source of all the questions
     */
    constructor(json) {
        this._questionList = new QuestionList();
        this._answerList = new AnswerList();

        this.generateQuestionList();
    }

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


    generateQuestionList() {
        let file = fs.readFile('seeders/data.json', 'utf8', (e, string) => {
            if (e) {
                console.log("Error reading file", e);
                return;
            }

            this.parseJsonToQuestions(JSON.parse(string).questions);
            this.parseJsonToAnswers(JSON.parse(string).answers);
        });
    }

    /**
     * Parse json to questions
     * @param questions in JSON format
     */
    parseJsonToQuestions(questions) {
        if ('undefined' !== typeof questions) {
            for (let q in questions) {
               this.questionList.addQuestion(new Question(questions[q]));
            }
        } else {
            console.error('No questions found in JSON file! TODO GOOD LOGGING');
        }
        console.table(this.questionList.all());
    }

    /**
     * Parse json to answers
     * @param answers in JSON format
     */
    parseJsonToAnswers(answers) {
        if ('undefined' !== typeof answers) {
            for (let a in answers) {
                this.answerList.addAnswer(new Answer(answers[a]));
            }
        } else {
            console.error('No answers found in JSON file! TODO GOOD LOGGING');
        }

        console.table(this.answerList.all());
    }

    /**
     * Get a question related to the given answers
     * @param answer
     */
    getCurrentQuestion(answer) {
        this.answerList.addGivenAnswer(answer);



    }




}

module.exports = Questionnaire;
