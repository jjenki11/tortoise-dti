#!/bin/bash

#idl helper script

echo "you are passing in the following file for batch importer: "$1
#exit
pushd $PWD
cd /raid1e/okan/DATA/DTIREG_paper_data/scripts/batch_import_dtireg/
idl -e "batch_import_dtireg_main,'$1'"
echo 'done with idl batch import'

popd
