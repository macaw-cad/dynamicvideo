"use strict";


class Question {

    /**
     *
     * @param json The question in JSON format
     */
    constructor(json) {
        this.parse(json);
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


    parse(json) {
        this._id = json.id;
        this._description = json.desc;
        this._answers = json.answers;
        this._basedOn = json.based_on;
    }


}

module.exports = Question;
