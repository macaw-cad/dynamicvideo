class Answer {

    /**
     *
     * @param description the description
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

    get tags() {
        return this._tags;
    }

    set tags(list) {
        this._tags = list;
    }


    parse(json) {
        this._id = json.id;
        this._description = json.desc;
        this._tags = json.tags;
    }
}

module.exports = Answer;
