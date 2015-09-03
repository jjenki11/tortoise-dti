#!/bin/bash

echo 'this will (eventually with a GUI/progress bar) do an automatic check for updates then launch the server.  after this is successful, the application will launch in the browser.'

# pull updates
cd /${1} && git pull;
# launch web server
xterm -e node /${1}'/Tortoise-Web-Services/Server/server.js' &
# launch browser w/ app
firefox /${1}'/Tortoise-Web-Services/Web/index_page.html' &
