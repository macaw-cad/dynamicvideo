"use strict";


class Question {

    /**
     *
     * @param json The question in JSON format
     */
    constructor(json) {
        // private variables
        // https://stackoverflow.com/questions/22528967/es6-class-variable-alternatives
        this._requiredFields = [
            '_id',
            '_description',
            '_answers',
        ];

        if (json) {
            this._parse(json);
        }
    }

    /**
     * Parse JSON to a Question object
     *
     * @param json
     * @private
     */
    _parse(json) {
        this._id = json.id;
        this._description = json.desc;
        this._answers = json.answers;
        this._basedOn = json.based_on;

        this._isValid();
    }

    /**
     * Check if the object is valid
     *
     * @private
     */
    _isValid() {
        for (const prop in this._requiredFields) {
            if (typeof this[this._requiredFields[prop]] === 'undefined') {

                // Throw error if field is undefined
                throw Error(this._requiredFields[prop] + " is not set on question " + this._id);
            } else if (Array.isArray(this[this._requiredFields[prop]]) &&
                this[this._requiredFields[prop]].length === 0) {

                // If the field is an array, throw an error if the length is 0
                throw Error("Empty array in question " + this._id);
            }
        }
    }

    /**
     * Getters & setters
     */

    get id() {
        return this._id;
    }

    set id(i) {
        this._id = i;
    }

    get description() {
        return this._description;
    }

    set description(d) {
        this._description = d;
    }

    get answers() {
        return this._answers;
    }

    set answers(list) {
        this._answers = list;
    }

    get basedOn() {
        return this._basedOn;
    }

    set basedOn(b) {
        this._basedOn = b;
    }

    get asked() {
        return this._asked;
    }

    set asked(a) {
        this._asked = a;
    }

}

module.exports = Question;
