[![Build status](https://dev.azure.com/MacawInteractive/DynamicVideo/_apis/build/status/DynamicVideo-CI)](https://dev.azure.com/MacawInteractive/DynamicVideo/_build/latest?definitionId=15)
#Dynamic Video
> A proof of concept which shows the possibilities for changing a streaming video on the server directly from the browser.

## Features


## Prerequisites
You must have the following software installed:
- FFmpeg

On Windows:
- The `PATH` variable to your FFmpeg installation should be set.

## Installation
Rename (or copy) `.env.example` to `.env` and change it according to your needs.
Some video's may be needed. They can be placed in the `video` folder.

After setting up the environment variables and add videos to the `video` folder, you can run the following commands to
install everything and run the program.
```bash
npm install
npm start
```

When developing, you can use `nodemon start` instead of `npm start` so the application will automatically
restart when there is a change detected while developing.

## Environment
There are different environment variables you can set. The variables are located in the `.env` file in the root folder of this project.

### Explanation


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
    - video_2.mp4
    - 3rd-video.mp4
- category-name
    - video.flv
    - ....
- `<generated_hash>.txt`
- `<generated_hash_playlist.txt>`

At the moment of writing, subdirectories within the category folders are not supported.
The `category-name` names have to correspond with the tags used in the data.json.
The `<generated_hash>` files are playlist files for FFmpeg which are automatically generated.

The filename of the videos cannot contain any spaces!
For more information about the videos, check the [videos](videos.md) readme.

## Contact
If you have any questions regarding this project, feel free to contact me with the following contact details:
- Dennis Volkering
- dennis.volkering@macaw.nl