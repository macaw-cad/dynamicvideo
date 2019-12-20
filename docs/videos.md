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



Some tips:
- Use videos with a duration of at least 5 seconds and a maximum of 15 seconds (which results in lower initial load and more diversity in videos)
- Compress the videos before placing them in the video folder
- Make sure all (or most of) the tags are covered with videos

Cutting videos can be done with the following command:
```bash
ffmpeg -ss 00:01:00 -i input.mp4 -to 00:02:00 -c copy output.mp4
# or, if the first option doesn't work for you:
ffmpeg -noaccurate_seek -ss 00:00:01.0 -i input.mp4 -to 00:00:10.0 -c copy output.mp4
```

Compressing videos can be done with the following command:
```bash
ffmpeg -r 25 -i input.mp4 -an -vcodec libx264 -crf 25 -vf scale=1280:720 -preset ultrafast -f flv -minrate 150k -maxrate 500k output.flv
```
