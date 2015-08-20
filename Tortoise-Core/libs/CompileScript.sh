#! /bin/bash



X=/home/jeff/Desktop/development/cua/cs507/course_files/DrChipDbg
Y=$PWD/;
cd $X
echo "X<$X>"
echo "Y<$Y>"

file=${Y}$1.cpp;
out=${Y}$1;
echo "file<$file>"
echo "out<$out>"

if [[ ! -r "$X/xtdio.h" ]]; then
	echo "[31m***error*** bad path to xtdio.h header file[m"
fi

if [[ ! -r "$X/xtdio.a" ]]; then
	echo "[31m***error*** bad path to xtdio.a library[m"
fi

if [[ ! -r "$file" ]]; then
	echo "[31m***error*** can't read file<${file}>[m"
fi

echo "cc -I$X $file $X/xtdio.a -o $out"
cc -I$X $file $X/xtdio.a -o $out
