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
        console.log("basedon:", basedOn);
        for (let q in this.questions) {
            console.log("question:", this.questions[q]);

            for (let bo in this.questions[q].basedOn) {
                // loop through _basedOn field of question
                console.log("basedOn:", this.questions[q].basedOn[bo]);

                if (this.questions[q].basedOn[bo] === basedOn) {

                    // OK SO: maybe there are multiple questions
                    return this.questions[q];
                }
            }
        }
        return null;
    }

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
        return this._givenQuestions;
    }

    set givenQuestions(ga) {
        this._givenQuestions = ga;
    }
}

module.exports = QuestionList;
