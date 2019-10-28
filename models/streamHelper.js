"use strict";

var fs = require("fs");
let ffmpeg = require('fluent-ffmpeg');

class StreamHelper {

    /**
     *
     */
    constructor() {
    }

    static initStream() {
        // todo
    }

    /**
     * Get all the subdirectories (as tags) and their source files from the video directory.
     *
     * @returns {Array} The source files with the tag
     */
    static getSceneList() {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        // Changed version from
        // https://stackoverflow.com/questions/20822273/best-way-to-get-folder-and-file-list-in-javascript
        // let dirs = [];


        var _getAllFilesFromFolder = function (dir) {
            var results = [];

            fs.readdirSync(dir).forEach(function (file) {
                let original = file;
                file = dir + '/' + file;
                var stat = fs.statSync(file);

                if (stat && stat.isDirectory()) {
                    // Recursive
                    results = results.concat(_getAllFilesFromFolder(file))
                } else {
                    results.push({
                        "tag": dir.match(/([^\/]*)\/*$/)[1], // The last directory from the filepath
                        "file": original
                    });
                }

            });

            return results;
        };

        return _getAllFilesFromFolder(global.rootDirectory + "/video");
    }


    static startStreaming() {
        // TODO: after refresh this gives an error. Maybe the URL random per session?
        // ALSO: after session, the ffmpeg session should be ended

        // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
        // Todo fix the source file, should be an .env option? (just like the output url)
        ffmpeg('video/root.txt')
            .addOptions([
                '-crf 25',
                '-preset ultrafast',
                '-f flv'
            ])
            .output('rtmp://localhost/live/test')
            .noAudio()
            .videoCodec('libx264')
            .size('?x720')
            .inputFPS(25)
            .on('end', callback)
            .run();

        function callback(s) {
            console.log(s);
        }
    }

    /**
     * Changes the scene
     */
    static changeScene(tag) {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        // Filter list on tag
        const newList = this.getSceneList().filter(function (a) {
            return a.tag === tag;
        });

        if (!(newList.length > 0)) {
            return false;
        }

        // return false if list is empty
        console.log('length:' + newList.length);

        let text = 'ffconcat version 1.0';
        for (let l in newList) {
            text += '\nfile ' + newList[l].tag + '/' + newList[l].file;
        }

        fs.writeFile(global.rootDirectory + '/video/nest.txt', text, (err => {
            if (err)
                throw err;
        }));

        return true;
    }
}

module.exports = StreamHelper;
