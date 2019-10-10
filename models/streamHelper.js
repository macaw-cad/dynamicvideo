"use strict";

const OBSWebSocket = require('obs-websocket-js');

class StreamHelper {

    /**
     *
     */
    constructor() {
    }

    static initStream(app) {
        // Connect to OBS websocket
        const obs = new OBSWebSocket();
        let sceneList = [];

        obs.connect({
            address: process.env.OBS_ADDRESS + ':' + process.env.OBS_PORT,
            password: process.env.OBS_PASSWORD
        }).then(() => {
            console.log(`Successful connection with OBS`);

            obs.send('GetSceneList').then(function (sl) {
                for (let id in sl.scenes) {
                    sceneList.push(sl.scenes[id].name);
                }

                app.set('sceneList', sceneList);
            }).catch(function (e) {
                console.error(e);
            });
        }).catch(function (e) {
            console.error(e);
        });

        // You must add this handler to avoid uncaught exceptions.
        obs.on('error', err => {
            console.error('socket error:', err);
        });

        return obs;
    }


    static setScene(obs, name) {
        obs.send('SetCurrentScene', {
            'scene-name': name
        }).catch(function(e) {
           throw e;
        });
    }

}

module.exports = StreamHelper;
