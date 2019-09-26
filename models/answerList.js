class AnswerList {

    /**
     *
     * @param answers The list of all the answers available
     */
    constructor(answers) {
        this.answers = answers;
    }

    /**
     * Get all available answers
     * @returns {array} with all available answers
     */
    all() {
        return this.answers;
    }

    /**
     * Add an answer
     * @param answer The answer to add to the list
     */
    addAnswer(answer) {
        this.answers.push(answer);
    }

    /**
     * Add an given answer
     * @param answer The answer to add to the list
     */
    addGivenAnswer(answer) {
        console.log('test');

        // check if the answer is already in the list
        if (!this.givenAnswers.includes(answer)) {
            this.givenAnswers.push(answer);
        } else {
            throw new Error("This answer is already submitted ");
        }
    }

    /**
     * Getters & Setters
     */

    /**
     * Get all available answers
     * @returns array All available answers
     */
    get answers() {
        if (typeof this._answers === "undefined") {
            this._answers = [];
        }

        return this._answers;
    }

    /**
     * Set all available answers
     * @param a A list of answers
     */
    set answers(a) {
        this._answers = a;
    }

    /**
     * Get all given answers
     * @returns {array} All given answers
     */
    get givenAnswers() {
        if (typeof this._givenAnswers === "undefined") {
            this._givenAnswers = [];
        }

        return this._givenAnswers;
    }

    /**
     * Set all given answers
     * @param ga A list with given answers
     */
    set givenAnswers(ga) {
        this._givenAnswers = ga;
    }


}

module.exports = AnswerList;
