#!/bin/bash

# init
mkdir tests/temp public/images

# clean up public folder
rm public/images/stacked.png

# slice video into images
ffmpeg -i tests/temp/*.mp4 -vf fps=1/3 tests/temp/stack_%03d.png

# align slices
stacker/bin/align_image_stack -i -x -y -z -a tests/temp/aligned_ tests/temp/stack_???.png

# stack slices
stacker/bin/enfuse -o public/images/stacked.png --exposure-weight=0 --saturation-weight=0 --contrast-weight=1 --hard-mask tests/temp/aligned_????.tif

# clean up working folder
rm tests/temp/*.*
