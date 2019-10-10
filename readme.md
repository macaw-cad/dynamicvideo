#Dynamic Video
This is a proof of concept which shows the possibilities for changing a streaming video on the server from the browser.

## Features


## Prerequisites
You must have the following software installed and running
- OBS Studio
- OBS Studio Websocket

## Installation
Rename `.env.example` to `.env` and change it according to your needs.
Run OBS Studio and make sure the OBS Studio Websocket settings are the same as the `OBS_*` environment variables.

To change the OBS Studio Websocket settings, go to OBS Studio > Tools > Websocket Server Settings.

```bash
npm install
npm start
```

When developing, you can use `nodemon start` instead of `npm start` so the application will automatically 
restart when there is a change detected while developing.

## Documentation
All documentation can be found in the `docs` folder