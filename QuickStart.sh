#!/bin/bash
echo 'this will do an automatic check for updates then launch the server.  after this is successful, the application will launch in the browser.'
path=$PWD
xterm -e git pull &

xterm -e node /home/jeff/Desktop/tortoise_repo/tortoise-dti/Tortoise-Web-Services/Server/server.js &

firefox /home/jeff/Desktop/tortoise_repo/tortoise-dti/Tortoise-Web-Services/Web/index_page.html &
