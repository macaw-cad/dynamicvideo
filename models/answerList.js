class AnswerList {

    /**
     *
     * @param answers The list of all the answers available
     */
    constructor(answers) {
        this.answers = answers;
    }

    /**
     * Getters & Setters
     */

    /**
     * Get all available answers
     * @returns {array} with all available answers
     */
    all() {
        return this.answers;
    }

    /**
     * Get answer by ID
     * @param id
     */
    find(id) {
        if (Array.isArray(id)) {
            return this.answers.filter(a => {
                return id.includes(a.id);
            });
        } else {
            return this.answers.find(a => {
                return id === a.id;
            });
        }
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

        // check if the answer is already in the list
        if (!this.givenAnswers.includes(answer)) {
            this.givenAnswers.push(answer);
        } else {
            throw new Error("This answer is already submitted ");
        }
    }


    /**
     * Getters & setters
     */

    get answers() {
        if (typeof this._answers === "undefined") {
            this._answers = [];
        }

        return this._answers;
    }

    set answers(a) {
        this._answers = a;
    }

    get givenAnswers() {
        if (typeof this._givenAnswers === "undefined") {
            this._givenAnswers = [];
        }

        return this._givenAnswers;
    }

    set givenAnswers(ga) {
        this._givenAnswers = ga;
    }
}

module.exports = AnswerList;
