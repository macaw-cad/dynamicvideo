"use strict";


class TagList {

    /**
     *
     * @param tags The list of all the tags available
     */
    constructor(tags) {
        this._tags = [];
        this._tags = tags;
    }

    addTag(tag) {
        this.tags.push(tag);
    }

    get tags() {
        if(typeof this._tags === "undefined") {
            this._tags = [];
        }

        return this._tags;
    }

    set tags(a) {
        this._tags = a;
    }

    all() {
        return this.tags;
    }

    /**
     * Return tag corresponding with given title
     *
     * @param title
     */
    find(title) {
       for(let tag in this.tags) {
           if(this.tags[tag].title === title) {
               return this.tags[tag];
           }
       }
    }
}

module.exports = TagList;
