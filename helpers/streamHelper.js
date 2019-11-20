"use strict";

var fs = require("fs");
let ffmpeg = require('fluent-ffmpeg');
const FileHelper = require('./fileHelper');
const Logger = require('./logger');

class StreamHelper {

    /**
     *
     */
    constructor() {
        this.fileHelper = new FileHelper();
    }

    /**
     * Get all the subdirectories (as tags) and their source files from the video directory.
     *
     * @returns {Array} The source files with the tag
     */
    _getSceneList() {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        return this.fileHelper.getAllFilesFromFolder(global.rootDirectory + "/video");
    }

    /**
     *
     */
    startStreaming(sessionId) {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        this.fileHelper.buildRootPlaylist(sessionId);

        // TODO: after refresh this gives an error. Maybe the URL random per session?
        // ALSO: after session, the ffmpeg session should be ended

        // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
        ffmpeg(global.rootDirectory + '/video/' + sessionId + '.txt')
            .inputOptions(
                '-re'
            )
            .addOptions([
                // '-c copy', // doesn't work with streaming
                '-f flv'
            ])
            .output('rtmp://localhost/live/test')
            .noAudio()
            .videoCodec('libx264') //otherwise it stops after first vid
            // .inputFPS(25)
            .on('error', function (s) {
                Logger.log('Error on ffmpeg process');
                console.trace(s);
            })
            .on('end', function () {
                Logger.log('Merging finished !');
            }).on('start', function (commandLine) {
            Logger.log('Spawned Ffmpeg with command: ' + commandLine)
        })
            .run();
    }

    /**
     * Changes the scene
     *
     * @param tag
     * @param sessionId
     *
     * @returns {boolean} true if a scene is available, false if not
     */
    changeScene(tag, sessionId) {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        // Filter list on tag
        const newList = this._getSceneList().filter(function (a) {
            return a.tag === tag;
        });

        // return false if list is empty
        if (!(newList.length > 0)) {
            Logger.warn('There are no available videos to play.')
            return false;
        }

        // Build text for playlist file
        let text = 'ffconcat version 1.0';
        for (let l in newList) {
            text += '\nfile ' + newList[l].tag + '/' + newList[l].file;
        }

        this.fileHelper.changeFileContents(global.rootDirectory + '/video/' + sessionId + '_playlist.txt', text);

        return true;
    }


    get fileHelper() {
        return this._fileHelper;
    }

    set fileHelper(value) {
        this._fileHelper = value;
    }
}

module.exports = StreamHelper;
