class Tag {

    /**
     *
     * @param json The tag in JSON format
     */
    constructor(json) {
        this._requiredFields = [
            '_id',
            '_title'
        ];

        this._parse(json);
    }

    get id() {
        return this._id;
    }

    set id(i) {
        this._id = i;
    }

    get title() {
        return this._title;
    }

    set title(d) {
        this._title = d;
    }

    get count() {
        if (!this._count) {
            return 0;
        }

        return this._count;
    }

    set count(d) {
        this._count = d;
    }

    get playCount() {

        if (!this._playCount) {
            return 0;
        }

        return this._playCount;
    }

    set playCount(d) {
        this._playCount = d;
    }

    _parse(json) {
        this._id = json.id;
        this._title = json.title;

        this._isValid();
    }

    _isValid() {
        for (const prop in this._requiredFields) {
            if (typeof this[this._requiredFields[prop]] === 'undefined') {
                throw Error(this._requiredFields[prop] + " is not set on tag " + this._id);
            }
        }
        return true;
    }
}

module.exports = Tag;
