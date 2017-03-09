#!/bin/bash
#Script for installing game server on Linux
#Needs an accompanying .zip file with the actual game files..

curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get intall unzip
npm install express --save
npm install socket.io --save
npm install forever --save
unzip spyvsspy.zip
forever start Game-Server.js >> game-log.txt &
forever start Content-Server.js >> content-log.txt &