[![Build status](https://dev.azure.com/MacawInteractive/DynamicVideo/_apis/build/status/DynamicVideo-CI)](https://dev.azure.com/MacawInteractive/DynamicVideo/_build/latest?definitionId=15)
#Dynamic Video
> A proof of concept which shows the possibilities for changing a streaming video on the server directly from the browser.

## Features


## Prerequisites
You must have the following software installed:
- FFmpeg (version >=0.9)

On Windows:
- The `PATH` variable to your FFmpeg installation should be set.

## Installation
Rename (or copy) `.env.example` to `.env` and change it according to your needs.

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
There are some requirements attached to the data. This will also be tested with the tests within the project.
The data.json file should be structured like this:
- questions `array:question`
- answers `array:answer`

The questions array should contain only questions. Every question is an object and structured as follows:
- id `int`
- desc `string`
- answers `array:int` (refers to answer->id)
- based_on `array:string` (refers to answer->tags)

The answers array should contain only answers. Every answer is an object and structured as follows:
- id `int`
- desc `string`
- tags `array:string`

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
