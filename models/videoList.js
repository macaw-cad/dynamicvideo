"use strict";


class VideoList {

    /**
     *
     * @param videos The list of all the videos available
     */
    constructor(videos) {
        this._videos = [];
        this._videos = videos;
    }

    all() {
        return this.videos;
    }

    addVideo(video) {
        this.videos.push(video);
    }

    /**
     * Getters & setters
     */

    get videos() {
        if (typeof this._videos === "undefined") {
            this._videos = [];
        }

        return this._videos;
    }

    set videos(a) {
        this._videos = a;
    }
}

module.exports = VideoList;
