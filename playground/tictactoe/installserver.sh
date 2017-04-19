#!/bin/bash
echo "Updating system..."
# sudo apt-get update
# sudo apt-get upgrade
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install unzip
sudo npm install express --save
sudo npm install socket.io --save
sudo npm install forever -g --save
unzip spy.zip
nohup forever start server.js >> server-log.txt
nohup forever start Content-Server.js >> content-log.txt
