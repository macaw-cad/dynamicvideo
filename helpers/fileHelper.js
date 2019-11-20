"use strict";

const fs = require("fs");
const chalk = require('chalk');

class FileHelper {

    /**
     *
     */
    constructor() {
    }

    // let dirs = [];
    // Todo fix the source file, should be an .env option? (just like the output url)
    // TODO we need to check if the file is an [.mp4] (maybe array of supported video formats?)
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
            let original = file;

            file = dir + '/' + file;
            let stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                // Recursive
                results = results.concat(t.getAllFilesFromFolder(file));
            } else {

                // TODO make this an array with supported formats
                if (supportedVideoFormats.includes(original.slice(original.length - 4))) {
                    results.push({
                        "tag": dir.match(/([^\/]*)\/*$/)[1], // The last directory from the filepath
                        "file": original
                    });
                } else {
                    console.warn(chalk.yellow(original + ' is not a supported video file'));
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
