"use strict";

const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
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
     * Start the video stream
     *
     * @param sessionId
     * @param questionnaire
     */
    startStreaming(sessionId, questionnaire) {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        // Create a playlist and set the default scene
        try {
            this.fileHelper.buildRootPlaylist(sessionId);
            this.changeScene(sessionId, questionnaire);
        } catch (e) {
            Logger.error('Error while setting the default scene:' + e);
            //throw?
        }

        // Save "this" to t so we can use this in the ffmpeg scope
        const t = this;
        const outputUrl = 'rtmp://localhost/live/' + sessionId;

        // TODO: after refresh this gives an error. Maybe the URL random per session?
        // TODO: Quit process after session close

        // https://github.com/fluent-ffmpeg/node-fluent-ffmpeg

        ffmpeg(global.rootDirectory + '/video/' + sessionId + '.txt')
            .setFfmpegPath(ffmpegPath)
            .inputOptions(
                '-re'
            )
            .addOptions([
                '-f flv'
            ])
            .output(outputUrl)
            .noAudio()
            .videoCodec('libx264')
            .on('error', function (s) {
                Logger.error('Error on ffmpeg process');
                throw Error(s);
            })
            .on('end', function () {
                Logger.info('Done streaming!');
            })
            .on('start', function (command) {
                t.setSceneChanger(command, sessionId, questionnaire)
            })
            .run();
    }

    /**
     *
     * @param commandLine
     * @param sessionId
     * @param questionnaire
     */
    setSceneChanger(commandLine, sessionId, questionnaire) {
        Logger.info('Spawned Ffmpeg with command: ' + commandLine);

        const t = this;
        let counter = 5000; // milliseconds

        let changer = function () {
            t.changeScene(sessionId, questionnaire);

            // Call the function again after X seconds
            if (questionnaire.needsRemoval !== true) {
                timeout = setTimeout(changer, counter);
            } else {
                Logger.info('Ended SceneChanger!');
                questionnaire = undefined;
                clearTimeout(timeout);
            }
        };

        let timeout = setTimeout(changer, counter);
    }


    /**
     * Changes the scene
     *
     * @param tag {Tag|string} A tag object or the title of a tag
     * @param sessionId {string} The ID of the current session
     * @param questionnaire
     *
     * @returns {boolean} true if a scene is available, false if not
     */
    changeScene(sessionId, questionnaire) {
        if (!global.rootDirectory) {
            throw new Error('Global variable rootDirectory is not set.');
        }

        let tag = '';
        // If there are still no answers given
        if (questionnaire.answerList.givenAnswers.length === 0) {
            // Choose a random question to start with
            tag = 'default';
        } else {
            // Get the best tag available
            tag = questionnaire.tagList.getBestTag();

            // Increase the amount of plays and change the scene
            tag.playCount++;
        }

        let playlist = [];
        const videos = questionnaire.videoList.videos;

        // Match videos with the best tag available
        for(const v in videos) {
            if(videos[v].tags.includes(typeof tag === 'object' ? tag.title : tag)) {
                playlist.push(videos[v].source);
            }
        }

        // return false if list is empty
        if (!(playlist.length > 0)) {
            Logger.warn('There are no available videos to play for tag "' + (typeof tag === 'object' ? tag.title : tag) + '".');
            return false;
        }

        // Build text for playlist file
        let text = 'ffconcat version 1.0';
        for (let l in playlist) {
            text += '\nfile ' + playlist[l];
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

    get sceneList() {
        return this._sceneList;
    }

    set sceneList(value) {
        this._sceneList = value;
    }
}

module.exports = StreamHelper;
