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


    _parse(json) {
        this._id = json.id;
        this._description = json.desc;
        this._tags = json.tags;

        this._isValid();
    }

    _isValid() {
        for (const prop in this._requiredFields) {
            if (typeof this[this._requiredFields[prop]] === 'undefined') {

                // Throw error if field is undefined
                throw Error(this._requiredFields[prop] + " is not set on answer " + this._id);
            } else if (Array.isArray(this[this._requiredFields[prop]]) &&
                this[this._requiredFields[prop]].length === 0) {

                // If the field is an array, throw an error if the length is 0
                throw Error("Empty array in answer " + this._id);
            }
        }
        return true;
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

    get tags() {
        return this._tags;
    }

    set tags(list) {
        this._tags = list;
    }
}

module.exports = Answer;
