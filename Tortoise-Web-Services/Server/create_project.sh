#!/bin/bash

cd Projects && mkdir $1;

cd $1;
echo "y" > "answer_file.txt"
chmod 777 answer_file.txt
mkdir working;
 while IFS=',' read -ra ADDR; do
      for i in "${ADDR[@]}"; do
          # process "$i"
          echo ${i}
          mkdir ${i}
      done
 done <<< "$2"
 
#mkdir working;

#mkdir patients;
#mkdir controls;

