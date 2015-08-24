#!/bin/bash

cd Projects && mkdir $1;

cd $1;
echo "y" > "answer_file.txt"
chmod 777 answer_file.txt
mkdir patients;
mkdir controls;
mkdir working;
