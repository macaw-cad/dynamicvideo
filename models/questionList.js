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
     * @param basedOn
     * @returns {null|*}
     */
    findByBasedOn(basedOn) {
        return this.questions.filter(q => {
            return (typeof q.basedOn !== 'undefined') ? q.basedOn.includes(basedOn) : false;
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

    get givenQuestions() {
        if (typeof this._givenQuestions === "undefined") {
            this._givenQuestions = [];
        }

        return this._givenQuestions;
    }

    set givenQuestions(ga) {
        this._givenQuestions = ga;
    }
}

module.exports = QuestionList;
