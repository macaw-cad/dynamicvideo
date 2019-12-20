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

    all() {
        return this.questions;
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    /**
     *
     * @returns {*|null}
     */
    getAvailableQuestions() {
        return this.questions.filter(q => {
            return q.asked !== true;
        }) || null;
    }

    /**
     * Getters & setters
     */

    get questions() {
        if (typeof this._questions === "undefined") {
            this._questions = [];
        }

        return this._questions;
    }

    set questions(a) {
        this._questions = a;
    }
}

module.exports = QuestionList;
