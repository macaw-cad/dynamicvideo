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

    getBestTag() {
        // Sort them
        this.tags.sort((a,b) => (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0));

        // Return first one (with most count)
        return this.tags[0];
    }

}

module.exports = TagList;
