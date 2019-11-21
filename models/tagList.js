"use strict";

const Logger = require('../helpers/logger');

class TagList {

    /**
     *
     * @param tags The list of all the tags available
     */
    constructor(tags) {
        this._tags = [];
        this._tags = tags;
    }

    get tags() {
        if (typeof this._tags === "undefined") {
            this._tags = [];
        }

        return this._tags;
    }

    set tags(a) {
        this._tags = a;
    }

    /**
     * Get all the tags
     *
     * @param sorted if they need to be sorted
     * @returns array All available tags
     */
    all(sorted) {
        if (sorted !== true) {
            return this.tags;
        } else {
            return this.tags.sort((a, b) => (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0));
        }
    }

    /**
     * Return tag corresponding with given title
     *
     * @param title
     */
    find(title) {
        for (let tag in this.tags) {
            if (this.tags[tag].title === title) {
                return this.tags[tag];
            }
        }
    }

    addTag(tag) {
        // Don't add the tag if the tag is already in the list.
        for (let t in this.tags) {
            if (this.tags[t].title === tag.title) {
                // Notify in console
                Logger.info('Tag "' + tag.title + '" is a duplicate, it will not be added again.');
                return;
            }
        }

        this.tags.push(tag);
    }

    /**
     *
     * @returns {*}
     */
    getBestTag() {

        // Send the best available tag
        // The play count should be as low as possible
        // But count should be as high as possible.

        // Maybe brain.js?

        console.table(this.all(true));


        return this.all(true)[0];


    }

}

module.exports = TagList;
