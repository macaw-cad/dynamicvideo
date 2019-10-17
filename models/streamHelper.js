"use strict";

const OBSWebSocket = require('obs-websocket-js');

class StreamHelper {

    /**
     *
     */
    constructor() {
    }

    static initStream() {
        // Connect to OBS websocket
        const obs = new OBSWebSocket();

        obs.connect({
            address: process.env.OBS_ADDRESS + ':' + process.env.OBS_PORT,
            password: process.env.OBS_PASSWORD
        }).then(() => {
            console.log(`Successful connection with OBS`);

            StreamHelper.getSceneList(obs);
        }).catch(function (e) {
            console.error(e);
        });

        // You must add this handler to avoid uncaught exceptions.
        obs.on('error', err => {
            console.error('socket error:', err);
        });

        return obs;
    }

    static getSceneList(obs) {
        let sceneList = [];

        return obs.send('GetSceneList').then(function (sl) {
            for (let id in sl.scenes) {
                sceneList.push(sl.scenes[id].name);
            }

            return sceneList;
        }).catch(function (e) {
            console.error(e);
        });
    }

    static startStreaming(obs) {
        obs.sendCallback('StartStreaming', (error) => {
            console.error(error);
        });
    }

    /**
     *
     *
     * @param obs
     * @param tag
     * @returns {Promise<boolean>}
     */
    static async changeScene(obs, tag) {
        const sceneList = await StreamHelper.getSceneList(obs);

        for (let s in sceneList) {
            // Check if the tag meets the scene from the scenelist
            if (sceneList[s] === tag) {
                try {
                    StreamHelper.setScene(obs, sceneList[s]);
                    return true;
                } catch (e) {
                    throw e;
                }
            }
        }

        return false;
    }


    static setScene(obs, name) {
        obs.send('SetCurrentScene', {
            'scene-name': name
        }).catch(function (e) {
            throw e;
        });
    }

}

module.exports = StreamHelper;
