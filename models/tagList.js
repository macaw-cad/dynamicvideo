"use strict";

const Logger = require('../helpers/logger');

class TagList {

    /**
     * The constructor
     *
     * @param tags A list of all the available tags
     */
    constructor(tags) {
        this._tags = [];
        this._tags = tags;
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
     * Get a tag corresponding with given title
     *
     * @param title The title of the tag
     */
    find(title) {
        for (let tag in this.tags) {
            if (this.tags[tag].title === title) {
                return this.tags[tag];
            }
        }
    }

    /**
     * Add a tag to the TagList.
     *
     * @param tag The tag which needs to be added to the list.
     */
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
     * Get the best available tag
     * The play count should be as low as possible, and the count must be as high as possible.
     *
     * @returns {Tag} The best available tag
     */
    getBestTag() {
        // Sort the list of tags
        let sorted = this.tags.sort(
            function (tagA, tagB) {
                // if they are both 0, put the one with the lowest play count on top
                if (tagA.count === 0 && tagB.count === 0) {
                    return tagA.playCount - tagB.playCount;
                }

                // If the tag count is zero, make sure the tag is at the bottom of the list
                if (tagA.count === 0) {
                    return 1;
                }
                if (tagB.count === 0) {
                    return -1
                }

                // Sort at first by playCount ascending (so most played is lower)
                // Then on count descending. (so amount of answers on top)
                return tagA.playCount - tagB.playCount || tagB.count - tagA.count;
            }
        );

        // The tag with the most count and least playcount will be returned.
        return sorted[0];
    }

    /**
     * Getters & setters
     */

    get tags() {
        if (typeof this._tags === "undefined") {
            this._tags = [];
        }

        return this._tags;
    }

    set tags(a) {
        this._tags = a;
    }

}

module.exports = TagList;
