#!/bin/bash

#ROI Bizness

neda_path=/stbb_home/sadeghin/cDTIeDTI

code_path=/raid1e/raid1_restore/okan/ROI_business/continuous_ROI

#data_path=/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working/
data_path=$5
#all_lists_filename, all_tensors_filename,ROIs_filename,outputfilename

# /stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working_atlas/test_roi

cd $data_path
cd ../
pushd $PWD
cd ${code_path}

arr=$(echo $1 | tr "," "\n")

for x in $arr
do
    echo "$x"
    find ${data_path}*_proc -name '*_'$x'.nii' ! -name 'cd*' > $data_path/tensor_${x}_files.txt
    echo ' ' >> $data_path/tensor_${x}_files.txt
    
    lfn=$data_path/tensor_${x}_files.txt
    tfn=$data_path/tensor_${x}_files.txt
    rfn=$2
    ofn=$3
    group=$4
    echo 'lfn = '${lfn}
    echo 'tfn = '${tfn}
    echo 'rfn = '${rfn}
    echo 'ofn = '${ofn}
    echo 'group='${group}
    idl -e "extract_roi_values_and_save_jeff,'${lfn}','${tfn}','${rfn}','${ofn}_${x}.csv','${group}'"
    echo 'done with roi business for derived value: '${x}
    
done



#exit
#lfn=$1
#lfn='/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working/tensor_FA_files.txt'
#tfn=$2
#tfn='/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working/tensor_FA_files.txt'
#rfn=$3
#rfn='/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working_atlas/roi_list.txt'
#ofn=$4
#ofn="/stbb_home/jenkinsjc/Desktop/tortoise-dti-master/tortoise-dti/Tortoise-Web-Services/Server/Projects/atlas_test/working_atlas/roi_business_out.csv"








popd

echo "wow, its done??"
exit
