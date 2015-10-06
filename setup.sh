#!/bin/bash

echo "Annnnnd welcome to the auto-install program!"

echo "first we will install npm, then we will extract node." 

sudo apt-get install nodejs
sudo apt-get install npm
pushd $PWD
#cd Tortoise-Node
#tar -xzvf node-v0.12.7.tar.gz

#cd node-v0.12.7 && ./configure && make && make install
cd ../../Tortoise-Web-Services/Server

echo "build all of our node modules"

sudo /usr/local/bin/npm install

echo "Should be good to go! yay.  may take a while though!"

popd
$PWD/create_icon.sh
