class Tag {

    /**
     *
     * @param description the description
     */
    constructor(description) {
        this._description = description;
    }

    get description() {
        return this._description;
    }

    set description(d) {
        this._description = d;
    }
}

module.exports = Tag;
