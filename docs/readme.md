[![Build status](https://dev.azure.com/MacawInteractive/DynamicVideo/_apis/build/status/DynamicVideo-CI)](https://dev.azure.com/MacawInteractive/DynamicVideo/_build/latest?definitionId=15)
#Dynamic Video
> A proof of concept which shows the possibilities for changing a streaming video on the server directly from the browser.

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

## Environment
There are different environment variables you can set. The variables are located in the `.env` file in the root folder of this project.

## Data
The data is provided in the `data` folder. The main data file is `data.json`, while the other files are there for test purposes.

## Videos
The videos are stored in the `video` folder with the following file structure:
- category-name
    - 1.mp4
    - 2.mp4
    - 3.mp4
- category-name
    - 1.mp4
    - ....
- root.txt
- nest.txt

At the moment of writing, subdirectories within the category folders are not supported.
The `category-name` names have to be the same as the tags used in the data.json.
The content of `root.txt` will remain the same, while `nest.txt` will be changed when the scenes will switch.
