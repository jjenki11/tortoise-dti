#!/bin/bash
#ROI Bizness
neda_path=/stbb_home/sadeghin/cDTIeDTI
code_path=/raid1e/raid1_restore/okan/ROI_business/continuous_ROI
data_path=$5
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
    idl -e "extract_roi_values_and_save_jeff,'${lfn}','${tfn}','${rfn}','${ofn}_${x}.csv','${group}','${x}'"
    echo 'done with roi business for derived value: '${x}    
    cat ${ofn}_${x}.csv >> ${ofn}.csv
    rm ${ofn}_${x}.csv
done
popd

echo "wow, its done??"
exit
