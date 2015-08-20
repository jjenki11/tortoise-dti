#! /bin/bash


repo_dir=/stbb_home/jenkinsjc/Desktop/new_tortoiseDti/Tortoise-Core/libs
script_dir=/raid1b/STBBapps/DTIREG/bin
ami_path=/raid1e/nayaka/DTIreg_executables

#echo $2

work_dir=/stbb_home/jenkinsjc/Desktop/new_tortoiseDti/Tortoise-Web-Services/Server/Projects/dti_data

pushd $PWD
cd $(dirname "$1")

group_name=$2

rm affine_files.txt
rm deffield_files.txt
rm original_files.txt
rm combined_displacement*.nii
rm *~

affine_files=$PWD/affine_files.txt
deffield_files=$PWD/deffield_files.txt
original_files=$PWD/original_files.txt

ls *_aff.txt > $affine_files
ls *_deffield_MINV.nii > $deffield_files




find_ORIGINAL="$(find . ! -name '.' ! -name '*output*' ! -name '*bined_dis*' \
       ! -name '*_deffield*' ! -name '*_diffeo*' ! -name '*_aff*.nii' \
       ! -name '*_rigid.nii' ! -name '*.text' ! -name '*.txt' ! -name '*target*' ! -name '*.txt~' )"       
nchars=${#find_ORIGINAL}
ORIGINAL=${find_ORIGINAL}
#:2:nchars-1}     

#echo "$ORIGINAL" > "$original_files"
#cp $original_files $work_dir/working
#echo "copied orig to working dir"

#popd


array0=()
array1=()
array2=()
array3=()


getArray_0() {
    i=0
    while read line # Read a line
    do
        array0[i]=$line # Put it into the array
        i=$(($i + 1))
    done < $1
}
# Read the file in parameter and fill the array named "array1"
getArray_1() {
    i=0
    while read line # Read a line
    do
        array1[i]=$line # Put it into the array
        i=$(($i + 1))
    done < $1
}

# Read the file in parameter and fill the array named "array2"
getArray_2() {
    i=0
    while read line # Read a line
    do
        array2[i]=$line # Put it into the array
        i=$(($i + 1))
    done < $1
}
# Read the file in parameter and fill the array named "array3"
getArray_3() {
    i=0
    while read line # Read a line
    do
        array3[i]=$line # Put it into the array
        i=$(($i + 1))
    done < $1
}
# Print the file (print each element of the array)

getArray_1 $affine_files
getArray_2 $deffield_files
#getArray_3 $original_files


index=0

NIter=`cat ${affine_files} | wc -l`



while [ $index -lt $NIter ]
do
    save_path=$(dirname "$PWD/"${array1[$index]}"")
    input_name=$(basename "$PWD/"${array3[$index]}"")
# combine affine and diffeo into combined_displacement*.nii
    nchars=${#array1[$index]}
    ORIGINAL=${array1[$index]:0:nchars-8} 
    echo "${ORIGINAL}.nii" >> "$original_files"
    index=$((index+1))

done
cp $original_files $work_dir/working
echo "copied orig to working dir"

getArray_3 $original_files





index=0

NIter=`cat ${original_files} | wc -l`



while [ $index -lt $NIter ]
do
    echo "GET XFORM FILES"
    echo $PWD/"${array1[$index]}"
    echo $PWD/"${array2[$index]}"
    echo $PWD/"${array3[$index]}"
    
    save_path=$(dirname "$PWD/"${array1[$index]}"")
    input_name=$(basename "$PWD/"${array3[$index]}"")
# combine affine and diffeo into combined_displacement*.nii
    nchars=${#array3[$index]}
    ORIGINAL=${array3[$index]:0:nchars-4} 
#    Комбинированное смещение
    $repo_dir/combine_xform_helper.sh $PWD/"${array1[$index]}" $PWD/"${array2[$index]}" $PWD/combined_displacement_${ORIGINAL}.nii
# apply transformation to tensor :- <original>, <combined_displacement>, <output_file>, <reorientation_type>, <provide final atlas for correct dimensions>
    echo "FIAIAIFNA = "${ORIGINAL}
    #exit
    $script_dir/ApplyTransformationToTensor ${PWD}/${ORIGINAL} ${PWD}/combined_displacement_${ORIGINAL}.nii ${PWD}/output_${ORIGINAL}.nii FS ${PWD}/average_template_diffeo_6.nii
    #fname=${array3[$index]:2:nchars-6}    
    echo "FILENAME! ->>>> "${fname}
#calculate jacobian with same filename *_jac ( 0 is not logged)
    $ami_path/ComputeDeformationFieldJacobian ${PWD}/combined_displacement_${ORIGINAL}.nii 0    
    mv ${PWD}/combined_displacement_${ORIGINAL}_JAC.nii ${PWD}/combined_displacement_${ORIGINAL}_JAC_nolog.nii
#calculate log of jacobian with same filename *_log_jac ( 1 is logged )
    $ami_path/ComputeDeformationFieldJacobian ${PWD}/combined_displacement_${ORIGINAL}.nii 1
    mv ${PWD}/combined_displacement_${ORIGINAL}_JAC.nii ${PWD}/combined_displacement_${ORIGINAL}_JAC_logged.nii
    index=$((index+1))
    echo "done with iteration # "$index
done


cp ${PWD}/average_template_diffeo_6.nii $work_dir/working
mv $work_dir/working/average_template_diffeo_6.nii $work_dir/working/${2}_average_template_diffeo_6.nii

if [ -z "$3" ]
  then
    echo "No argument supplied"
    popd
    exit
fi

cp $original_files $work_dir/working
popd
exit
