#!/bin/bash

cd /raid1e/Jeff
rm -rf final_test_folder
mkdir final_test_folder
mkdir final_test_folder/working
cp -R test_data_for_dtireg_gui/* final_test_folder
echo "created new sandbox."
exit