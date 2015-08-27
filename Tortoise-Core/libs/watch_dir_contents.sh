#!/bin/bash
while  [  ! -f $1 ]
  do
     sleep 1
  done
echo "file found"
exit
