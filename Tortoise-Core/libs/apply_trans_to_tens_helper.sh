#!/bin/bash

output_path=$3

pushd $PWD

cd /raid1b/STBBapps/DTIREG/bin

#CombineTransformations $1 $2

ApplyTransformationToTensor $1 $2 $3 FS $2

#save_path=$(dirname "$1")
#input_name=$(basename "$1")

#nchars=${#input_name}
   # ORIGINAL=${input_name:0:nchars-4}; #to remove .nii
    #mv $save_path/combined_displacement.nii $output_path/combined_displacement_$ORIGINAL.nii
    sleep 5
    #mv $save_path/combined_displacement.nii $output_path

popd
exit



