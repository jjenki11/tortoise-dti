#!/bin/bash

echo 'this will do an automatic check for updates then launch the server.  after this is successful, the application will launch in the browser.'

git pull

node Tortoise-Web-Services/Server/server.js &

firefox Tortoise-Web-Services/Web/index_page.html &
