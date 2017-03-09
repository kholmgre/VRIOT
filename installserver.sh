#!/bin/bash
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get intall unzip
npm install express --save
npm install socket.io --save
unzip spyvsspy.zip
forever start Game-Server.js >> game-log.txt &
forever start Content-Server.js >> content-log.txt &