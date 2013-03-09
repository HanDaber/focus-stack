#!/bin/bash

ls -al

stacker/bin/align_image_stack -i -x -y -z -a stacker/aligned_ stacker/stack_???.png

stacker/bin/enfuse -o public/images/stacked.png --exposure-weight=0 --saturation-weight=0 --contrast-weight=1 --hard-mask stacker/aligned_????.tif

rm stacker/*.png stacker/*.tif
