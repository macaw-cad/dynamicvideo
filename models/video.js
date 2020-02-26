class Video {

    /**
     *
     * @param json The answer in JSON format
     */
    constructor(json) {
        this._requiredFields = [
            '_source',
            '_tags',
        ];

        this._parse(json);
    }


    _parse(json) {
        this._source = json.source;
        this._tags = json.tags;

        // this._isValid();
    }

    // _isValid() {
    //     for (const prop in this._requiredFields) {
    //         if (typeof this[this._requiredFields[prop]] === 'undefined') {
    //
    //             // Throw error if field is undefined
    //             throw Error(this._requiredFields[prop] + " is not set on video " + this._id);
    //         } else if (Array.isArray(this[this._requiredFields[prop]]) &&
    //             this[this._requiredFields[prop]].length === 0) {
    //
    //             // If the field is an array, throw an error if the length is 0
    //             throw Error("Empty array in answer " + this._id);
    //         }
    //     }
    //     return true;
    // }

    /**
     * Getters & setters
     */

    get source() {
        return this._source;
    }

    set source(src) {
        this._source = src;
    }

    get tags() {
        return this._tags;
    }

    set tags(list) {
        this._tags = list;
    }
}

module.exports = Video;
