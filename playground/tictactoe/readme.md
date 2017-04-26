# Tic Tac Toe

This is documentation for the WebAR project **Tic Tac Toe**.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Overall system description
Tic Tac Toe consists of one client and two servers. Both servers are Node applications built using Express. One server serves content such as the index.html for the client. The other server runs games and communicates with clients using sockets. The client is built using [A-Frame](https://aframe.io/) and [AR.js](https://github.com/jeromeetienne/AR.js).

### Prerequisites

You will need the following to get the project running:

#### NodeJS
https://nodejs.org/

### Installing

#### Clone the VRIOT repository

```
https://github.com/kholmgre/VRIOT.git
```

Go to the root folder of the project and run the following command to install all npm dependencies.

```
npm install
```

#### Run the server
The package.json contains some scripts that enables us to build the client and server. It also contains scripts that starts a Node https enabled server to serve files. We also have a Node server that runs the game-logic using sockets.

To build the client and server, issue these commands:

```
npm run buildTicServer
npm run buildTicClient
```

The commands above should start instances of Webpack that builds .js files to the /dist/ folder using the files in src as source.

#### Get SSL certificates
The next step is to acquire SSL certificates for the https servers. To do this there are two ways: either ask Kristofer Holmgren or Mikael Vesavuori, or [generate your own key using openssl](http://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl).

When you have the keys (key.pem and cert.pem), place them in the root folder.

#### Start a game
To be able to run a game on your local computer you can run the following commands:

```
npm run runTicContentserver
npm run runTicServer
```

When both servers are running, open up Chrome and go to [https://localhost:8080/](https://localhost:8080/)

Hold a printout of a hiro marker image. You can find a hiro image located in /playground/tictactoe/HIRO.jpg.

You should now see two options placed above the image: "Create game" and "Join game".

## Tests

At the moment we only have tests for the server.

There are two tasks involved when running tests:

```
npm run buildTicServerTests
npm run runTicServerTests
```

The first task builds the test using Webpack. The entry point is located in playground/tictactoe/src/server/tests/. Webpack emits the resulting .js file to
playground/tictactoe/test/.

The second task launches mocha, which will watch servertests.js for changes and run the tests.

## Deployment

We have deployed the system to an Ubuntu instance on Azure. To get the environment ready you must first install Node. After Node is installed you will need to install Forever, Express and Socket.io. You will also use Forever to start the Node servers and keep them running indefinitely.

### Install dependencies
Run the following commands in succession:

```
npm install forever -g
sudo npm install express
sudo npm install socket.io
```

### Copy files
When you have installed Node and forever, copy the following files from you local computer to the ubuntu-server (/home/username/):

```
/playground/tictactoe/index.html
/playground/tictactoe/package.json
/playground/tictactoe/Content-server.js
/playground/tictactoe/manifest.json
/playground/tictactoe/dist/*
/playground/tictactoe/assets/*
```

Don't forget to also copy your key.pem and cert.pem and place then in /home/username/.

### Start servers
To start the content-server run:

```
nohup forever start Content-Server.js
```

To start the game-server issue run:

```
nohup forever start server.js
```

The game should now be accessible by opening your browser and going to [https://your.ip.address:8080/](https://your.ip.address:8080/)

To check if the processes have started you can use the command `ps aux`. Another alternative is to type `forever -list` and check if you have to processes running. [Forever](https://github.com/foreverjs/forever) writes logs from its running processes – check its documentation if you need info on how to do that.

## Assets
Tic Tac Toe comprises a number of assets of varying type: audio, textures and 3D models with material description files. Assets are created in any standard tool for the content type. In our case we have used CFXR for audio, Blender for 3D models and Photoshop CC for textures.

### Asset management
Assets are sorted in a content type order, but you could of course use whatever kind of file structure you want.

### Audio
Audio files have been exported to 16-bit, 44100Hz WAV files. A-Frame should be able to support MP3 files as well.

### Textures
Textures are exported to mid-compressed 8-bit JPGs in sizes that are "powers of two", like 128x128, 256x256, 1024x1024 and similar. There is also one transparent PNG texture for the placement effect. We had to apply a bit of programmatic opacity through HTML to get this to work correctly.

Any old image should work when it comes to texturing, but using sizes that conform to powers of two makes rendering significantly faster, so make sure your work uses such size textures!

### Models
A-Frame supports several model types. We opted for OBJs which were exported from Blender. Accompanying the OBJs are MTL files, which were edited to contain a correct relative path to the model's texture (this was needed because the automatically exported path did not correspond to our project file structure). If you happen to see an untextured model, make sure that the path in the MTL is correct.

## Built With

### Server

* [NodeJs](https://nodejs.org/en/) - Server environment
* [Socket.io](https://socket.io/) - Server-client game communication
* [Express](https://expressjs.com/) - Server
* [Forever](https://github.com/foreverjs/forever) - Running server applications

### Client

* [A-Frame](https://aframe.io/) - Virtual reality web framework
* [AR.js](https://github.com/jeromeetienne/AR.js) - Augmented Reality for the Web

## Authors

* **Kristofer Holmgren** - *Client and server code*
* **Mikael Vesavuori** - *Testing, assets, ideas*

## Troubleshooting
Send an mail to kristofer.holmgren@sogeti.se



## Acknowledgments

* Many big thanks to [Jerome Etienne](https://github.com/jeromeetienne) for [AR.js](https://github.com/jeromeetienne/AR.js) and his dedication to helping and supporting its users
* Also many big thanks to the team behind [A-Frame](https://aframe.io/)
