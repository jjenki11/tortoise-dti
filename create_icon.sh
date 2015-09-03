#!/bin/bash

#  This script creates an icon as well as an executable file on the desktop.
#     Double click the turtle icon on the desktop and you can minimize the server window
p=$PWD
name="QuickStart.desktop"
exe_name="Tortoise Atlas Manager"
explain="Run web server and client app"
icon_path=$p/Tortoise-Web-Services/Web/img/turtle-icon.ico
exe_path=$p/QuickStart.sh
exe_args="%"$p
term="false"
appType="Application"

rm ~/Desktop/QuickStart.desktop
echo "[Desktop Entry]" > ~/Desktop/QuickStart.desktop
echo "Name=$exe_name" >> ~/Desktop/QuickStart.desktop
echo "Comment=$explain" >> ~/Desktop/QuickStart.desktop
echo "Exec=$exe_path $exe_args" >> ~/Desktop/QuickStart.desktop
echo "Icon=$icon_path" >> ~/Desktop/QuickStart.desktop
echo "Terminal=$term" >> ~/Desktop/QuickStart.desktop
echo "Type=$appType" >> ~/Desktop/QuickStart.desktop
chmod 777 ~/Desktop/QuickStart.desktop

