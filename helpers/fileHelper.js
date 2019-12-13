"use strict";

const fs = require("fs");
const Logger = require('./logger');

class FileHelper {

    /**
     *
     */
    constructor() {
    }

    /**
     * Reads the video folder for files, and lists them in an array.
     *
     * This is a changed version from
     * https://stackoverflow.com/questions/20822273/best-way-to-get-folder-and-file-list-in-javascript
     *
     * @param dir The root directory
     * @returns {Array} An array with all video files, based on their tag.
     */
    getAllFilesFromFolder(dir) {
        const supportedVideoFormats = ['.mp4', '.flv'];
        const t = this;
        let results = [];

        fs.readdirSync(dir).forEach(function (file) {
            // keep the original filename
            let original = file;

            file = dir + '/' + file;
            let stat = fs.statSync(file);

            // Check if the selected object is a file or directory.
            if (stat && stat.isDirectory()) {
                // Recursive
                results = results.concat(t.getAllFilesFromFolder(file));
            } else {

                // Check if the file has one of the supported video formats
                if (supportedVideoFormats.includes(original.slice(original.length - 4))) {
                    // Tag is the same as the name of the folder
                    const tag = dir.match(/([^\/]*)\/*$/)[1];

                    results.push({
                        "tag": tag, // The last directory from the filepath
                        "file": original,
                    });

                } else if (original.slice(original.length - 4) !== '.txt') {
                    // text files ignored in logging
                    Logger.log(original + ' is not a supported video file');
                }
            }
        });

        return results;
    }

    buildRootPlaylist(sessionId) {
        // Build text for playlist file
        let text = 'ffconcat version 1.0\n' +
            'file ' + sessionId + '_playlist.txt\n' +
            'file ' + sessionId + '.txt';

        this.changeFileContents(global.rootDirectory + '/video/' + sessionId + '.txt', text)
    }

    /**
     * TODO: This needs some checking
     *
     * @param source
     * @param text
     */
    changeFileContents(source, text) {
        fs.writeFile(source, text, (err => {
            if (err)
                throw err;
        }));
    }

}

module.exports = FileHelper;
