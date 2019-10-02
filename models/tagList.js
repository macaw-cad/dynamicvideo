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
     * @returns array All available tags
     */
    all() {
        return this.tags;
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

    /**
     * Get the best available tag
     *
     * @returns {Tag} The best tag available
     */
    getBestTag() {
        // Sort them
        this.tags.sort((a, b) => (a.count > b.count) ? -1 : ((b.count > a.count) ? 1 : 0));

        // Return first one (with most count)
        return this.tags[0];
    }

    addTag(tag) {
        // Don't add the tag if the tag is already in the list.
        for (let t in this.tags) {
            if (this.tags[t].title === tag.title) {
                // Notify in console
                console.log('Tag "' + tag.title + '" is a duplicate, it will not be added again.');
                return;
            }
        }

        this.tags.push(tag);
    }

}

module.exports = TagList;
