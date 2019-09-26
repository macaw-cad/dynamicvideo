"use strict";


class Question {

    /**
     *
     * @param json The question in JSON format
     */
    constructor(json) {
        // fuck this
        // https://stackoverflow.com/questions/22528967/es6-class-variable-alternatives
        this._requiredFields = [
            '_id',
            '_description',
            '_answers',
        ];

        this._parse(json);
    }

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


    _parse(json) {
        this._id = json.id;
        this._description = json.desc;
        this._answers = json.answers;
        this._basedOn = json.based_on;

        this._isValid();
    }


    _isValid() {
        for (const prop in this._requiredFields) {
            if (typeof this[this._requiredFields[prop]] === 'undefined') {
                throw Error(this._requiredFields[prop] + " is not set on question " + this._id);
            } else if (Array.isArray(this[this._requiredFields[prop]]) &&
                this[this._requiredFields[prop]].length === 0) {
                // Check if there are empty arrays in the _answers field
                throw Error("No answers available for question " + this._id);
            }
        }
    }
}

module.exports = Question;
