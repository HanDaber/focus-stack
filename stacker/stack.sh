#!/bin/bash

# ffmpeg -i tests/VID_20130225_122503.mp4 -vf fps=3 tests/temp/stack_%03d.png

stacker/bin/align_image_stack -i -x -y -z -a tests/temp/aligned_ tests/temp/stack_???.png

stacker/bin/enfuse -o public/images/stacked.png --exposure-weight=0 --saturation-weight=0 --contrast-weight=1 --hard-mask tests/temp/aligned_????.tif

rm tests/temp/*.png tests/temp/*.tif
