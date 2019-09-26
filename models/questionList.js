"use strict";


class QuestionList {

    /**
     *
     * @param questions The list of all the questions available
     */
    constructor(questions) {
        this._questions = [];
        this._questions = questions;
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    get questions() {
        if(typeof this._questions === "undefined") {
            this._questions = [];
        }

        return this._questions;
    }

    set questions(a) {
        this._questions = a;
    }

    get givenQuestions() {
        return this._givenQuestions;
    }

    set givenQuestions(ga) {
        this._givenQuestions = ga;
    }

    all() {
        return this.questions;
    }


}

module.exports = QuestionList;
