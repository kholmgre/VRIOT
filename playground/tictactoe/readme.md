# Tic tac toe

This is documentation for the WebAR project Tic tac toe. 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Overall system description
Tic tac toe consists of one client and two servers. Both servers are node applications built using express. One server serves content such as the index.html for the client. The other server runs games and communicates with clients using sockets. The client is built using aframe and ar.js.

### Prerequisites

You will need the following to get the project running

#### Nodejs
https://nodejs.org/

### Installing

Clone the VRIOT repository

```
https://github.com/kholmgre/VRIOT.git
```

Go to the root folder of the project and run the following command to install all npm dependencies

```
npm install
```

The package.json contains some scripts that enables us to build the client and server. It also contains scripts that starts a node https-enabled server to serve files. We also have a node server that runs the game-logic using sockets. 

To build the client and server, issue these command: 

```
npm run buildTicServer
npm run buildTicClient
```

The commands above should start instances of webpack that builds .js files to the /dist/ folder using the files in src as source.

The next step is to acquire ssl-certificates for the https-servers. To do this there are two ways; ask Kristofer Holmgren or Mikael Vesavuori or generate your own using openssl http://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl

Place the key.pem and cert.pem in the root folder.

To be able to run a game on your local computer you can issue the following commands: 

```
npm run cserver
npm run ticserver
```

When both servers are running, open up chrome and type: https://localhost:8080/ 

Hold a printout of a hiro image (a hiro image is located in /playground/tictactoe/HIRO.jpg)

You should see two options placed above the image: create game & join game

## Tests

At the moment we only test for the server. 

There are two tasks involved when running tests: 

```
npm run buildTicServerTests
npm run servertests
```

The first task builds the test using webpack. The entry point is located in playground/tictactoe/src/server/tests/. Webpack emits the .js file to 
playground/tictactoe/test/. 

The second task launches mocha that watches the servertests.js for changes and runs the tests. 

## Deployment

We have deployed the system to an Ubuntu instance on Azure. To get the environment ready you must install nodejs. After node is installed we will install forever, express and socket.io. You will also use Forever to start the node servers and keep them running. 

Run the commands

```
npm install forever -g
sudo npm install express 
sudo npm install socket.io 
```

When you have installed nodejs and forever, copy the following files from you local computer to the ubuntu-server (/home/username/): 

/playground/tictactoe/index.html
/playground/tictactoe/package.json
/playground/tictactoe/Content-server.js
/playground/tictactoe/manifest.json
/playground/tictactoe/dist/*
/playground/tictactoe/assets/*

Don't forget to also copy your key.pem and cert.pem and place then in /home/username/.

To start the content-server issue this command

nohup forever start Content-Server.js 

To start the game-server issue this command

nohup forever start server.js 

The game should now be accessable by opening your browser and typing: https://your.ip.address:8080/

To check if the processes have started you can use the command ps aux. Another alternative is to type forever -list and check if you have to processes running. Forever writes logs from its running processes, check the documentation for forever on info on how to do that. 

## Built With

### Server

* [NodeJs](https://nodejs.org/en/) - Server environment
* [Socket.io](https://socket.io/) - Server-client game communication
* [Express](https://expressjs.com/) - Server
* [Forever](https://github.com/foreverjs/forever) - Running server applications

### Client

* [a-frame](https://aframe.io/) - Virtual reality web framework
* [ar.js](https://github.com/jeromeetienne/AR.js) - Augmented Reality for the Web

## Authors

* **Kristofer Holmgren** - *Client and server code*
* **Mikael Vesavuori** - *Testing, 3d-models, Ideas*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Many big thanks to Jerome Etienne for ar.js and his decication to helping & supporting users of ar.js
* Also many big thanks to the team behind [a-frame](https://aframe.io/)