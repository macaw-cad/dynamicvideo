class Answer {

    /**
     *
     * @param json The answer in JSON format
     */
    constructor(json) {
        this._requiredFields = [
            '_id',
            '_description',
            '_tags',
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

    get tags() {
        return this._tags;
    }

    set tags(list) {
        this._tags = list;
    }


    _parse(json) {
        this._id = json.id;
        this._description = json.desc;
        this._tags = json.tags;

        this._isValid();
    }

    _isValid() {
        for (const prop in this._requiredFields) {
            if (typeof this[this._requiredFields[prop]] === 'undefined') {
                throw Error(this._requiredFields[prop] + " is not set on answer " + this._id);
            } else if (Array.isArray(this[this._requiredFields[prop]]) &&
                this[this._requiredFields[prop]].length === 0) {
                // Check if there are empty arrays in the _tags field
                throw Error("No tags available in answer " + this._id);
            }
        }
    }
}

module.exports = Answer;
