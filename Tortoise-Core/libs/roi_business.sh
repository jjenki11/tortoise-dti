#!/bin/bash

#ROI Bizness

neda_path=/stbb_home/sadeghin/cDTIeDTI

code_path=/raid1e/raid1_restore/okan/ROI_business/continuous_ROI

#all_lists_filename, all_tensors_filename,ROIs_filename,outputfilename

# /stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working_atlas/test_roi

#lfn=$1
lfn='/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working/tensor_FA_files.txt'
#tfn=$2
tfn='/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working/tensor_FA_files.txt'
#rfn=$3
rfn='/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working_atlas/roi_list.txt'
#ofn=$4
ofn="/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working_atlas/roi_business_out.csv"
der_vals=$5

pushd $PWD

cd ${code_path}


idl -e "extract_roi_values_and_save_jeff,'${lfn}','${tfn}','${rfn}','${ofn}'"
echo 'done with roi business...'

popd

echo "wow, its done??"
exit
