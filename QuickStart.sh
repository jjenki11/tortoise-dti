#!/bin/bash

echo 'this will (eventually with a GUI/progress bar) do an automatic check for updates then launch the server.  after this is successful, the application will launch in the browser.'

#notice that you can drop files onto the launcher and the launcher will save the filename(s) in ascending order of  '$2, ...'..  This is useful to make launchers to visualize displacement maps  or dec maps etc in the meantime.

# pull updates
#cd /${1} && git pull;
# launch web server
#cd ${1};
echo ${1}
cd /${1};
#echo ${2}
cd Tortoise-Web-Services/Server;
echo $PWD

#xterm -e NODE_PATH=$PWD 
#xterm -e node /${1}'/Tortoise-Web-Services/Server/server.js' &
xterm -e node server.js &
# launch browser w/ app
firefox /${1}'/Tortoise-Web-Services/Web/index_page.html' &
