#! /bin/bash

repo_dir=$5
#/stbb_home/jenkinsjc/Desktop/Trepo/Tortoise-Core/libs
script_dir=/raid1b/STBBapps/DTIREG/bin
ami_path=/raid1e/nayaka/DTIreg_executables
other_code_path=/raid1e/raid1_restore/codes/my_codes/DTIReg

src_group=$6
tgt_group=$7

echo "4 = "$4
work_dir=$4

#path to where the avg diffeo templates are
echo "1 = "$1

# prepended label for the one to be registered
echo "2 = "$2
# prepended label for the one who is registered w.r.t
echo "3 = "$3

# folder where original stuff came from
echo "4 = "

# folder where we are outputting everything
echo "5 = "

pushd $PWD

cd $1
rm *~
rm ../${3}/*~
rm ../${2}/*~
A_original_files=$PWD/${2}\_original_files.txt
B_original_files=$PWD/${3}\_original_files.txt

chmod 777 *

echo "OMG WTF   " ${PWD}/${3}_average_template_diffeo_6.nii"    "${PWD}/${2}_average_template_diffeo_6.nii

${other_code_path}/DTIREG/DTIREG --fixed_tensor ${PWD}/${3}_average_template_diffeo_6.nii --moving_tensor ${PWD}/${2}_average_template_diffeo_6.nii --metric DTITK --metric Trace -t SyN\[0.75,3,0.5\] -c 100x100x100 -f 4x2x1 -s 0.5x0.25x0 --final_reorientation FS

${repo_dir}/combine_xform_helper.sh ${PWD}/${2}_average_template_diffeo_6_aff.txt ${PWD}/${2}_average_template_diffeo_6_deffield_MINV.nii ${work_dir}/working/combined_displacement_${2}_average_template_diffeo_6.nii



# Read the file in parameter and fill the array named "array"
arrayA=()
arrayB=()

getArrayA() {
    i=0
    while read line # Read a line
    do
        arrayA[i]=$line # Put it into the array
        i=$(($i + 1))
    done < $1
}

getArrayB() {
    i=0
    while read line # Read a line
    do
        arrayB[i]=$line # Put it into the array
        i=$(($i + 1))
    done < $1
}

outFiles=${work_dir}/working/final_output_files.txt

rm $outFiles

getArrayA ${A_original_files}

getArrayB ${B_original_files}

index=0

NIterA=`cat ${A_original_files} | wc -l`

echo "before loop with "$NIterA " iterations."

while [ $index -lt $NIterA ]
do
    nchars=${#arrayA[$index]}
    fname=${arrayA[$index]:0:nchars-4}
     
    # Combine this combined with each patient's combined
    ${repo_dir}/combine_xform_helper.sh ${work_dir}/$2/combined_displacement_${fname}.nii ${work_dir}/working/combined_displacement_${2}_average_template_diffeo_6.nii ${work_dir}/working/cd_${fname}.nii
    #THEN, do Apply Transformation to tensor 
    
    ${script_dir}/ApplyTransformationToTensor ${work_dir}/$2/${fname}.nii ${work_dir}/working/cd_${fname}.nii ${work_dir}/working/final_warped_output_${fname}.nii FS ${work_dir}/${3}/average_template_diffeo_6.nii
    
    # make the file to pass into idl script
    echo "$PWD/final_warped_output_${fname}.nii" >> "$outFiles"
    
    echo "$index  (COMB TRANS) fname=$fname  |  ${work_dir}/${2}/combined_displacement_${fname}.nii  |  ${work_dir}/working/combined_displacement_${2}_average_template_diffeo_6.nii  |  ${work_dir}/working/cd_${fname}.nii" >> "status.txt"
    echo "$index  (APLY TRANS) fname=$fname  |  ${work_dir}/${2}/${fname}.nii  |  ${work_dir}/working/cd_${fname}.nii  |  ${work_dir}/working/final_warped_output_${fname}.nii  |  ${work_dir}/${3}/average_template_diffeo_6.nii" >> "status.txt"
    
    index=$((index+1))
    echo "done with iteration # "$index
    chmod 777 *  
    
done





${repo_dir}/combine_xform_helper.sh ${PWD}/${3}_average_template_diffeo_6_aff.txt ${PWD}/${3}_average_template_diffeo_6_deffield_MINV.nii ${work_dir}/working/combined_displacement_${3}_average_template_diffeo_6.nii


index=0
NIterB=`cat ${B_original_files} | wc -l`

echo "before loop with "$NIterB " iterations."

while [ $index -lt $NIterB ]
do
    ###########   NEW PART TO DO CONTROL TEMPLATE REG ALSO
    nchars=${#arrayB[$index]}
    fname=${arrayB[$index]:0:nchars-4}
     
    # Combine this combined with each patient's combined
    ${repo_dir}/combine_xform_helper.sh ${work_dir}/$3/combined_displacement_${fname}.nii ${work_dir}/working/combined_displacement_${3}_average_template_diffeo_6.nii ${work_dir}/working/cd_${fname}.nii
    #THEN, do Apply Transformation to tensor 
    
    ${script_dir}/ApplyTransformationToTensor ${work_dir}/$3/${fname}.nii ${work_dir}/working/cd_${fname}.nii ${work_dir}/working/final_warped_output_${fname}.nii FS ${work_dir}/${3}/average_template_diffeo_6.nii
    
    # make the file to pass into idl script
    echo "$PWD/final_warped_output_${fname}.nii" >> "$outFiles"
    
    echo "$index  (COMB TRANS) fname=$fname  |  ${work_dir}/${3}/combined_displacement_${fname}.nii  |  ${work_dir}/working/combined_displacement_${3}_average_template_diffeo_6.nii  |  ${work_dir}/working/cd_${fname}.nii" >> "status.txt"
    echo "$index  (APLY TRANS) fname=$fname  |  ${work_dir}/${3}/${fname}.nii  |  ${work_dir}/working/cd_${fname}.nii  |  ${work_dir}/working/final_warped_output_${fname}.nii  |  ${work_dir}/${3}/average_template_diffeo_6.nii" >> "status.txt"
    
    index=$((index+1))
    echo "done with iteration # "$index
    chmod 777 *

done 


cd /raid1e/okan/DATA/DTIREG_paper_data/scripts/batch_import_dtireg/
idl -e "batch_import_dtireg_main,'$outFiles'"
echo 'done with idl batch import'

popd

