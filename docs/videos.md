# Video docs
This document will explain (hopefully) everything about the videos in this project.

## Naming
The videos cannot contain any spaces. The videos are placed in the `video` folder within this project. To attach a
video to a tag, place the video in a folder named after the tag you want to attach it to.

### Example
If you want to add a video (named `video-1.mp4`) which covers the nature topic, place it in a folder named `nature`.
The file name isn't important, however make sure there are no spaces in the filename.
You'll get the following file structure:
- project-root
    - video
        - nature
            - `video-1.mp4`
            - nature-test.mp4
        - city
            - video.mp4
            - video-city_busy.mp4

## Better streaming results
You'll get better streaming results (which means lower CPU usage and lower bitrate) when you pre-process each video before placing it in the folder and use it.

- explanation ffmpeg
- command