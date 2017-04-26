# SpyVsSpy

This is documentation for the WebAR project SpyVsSpy.

## Description
This is a prototype for a virtual reality game where players can would move through different rooms and solve problems to advance to the next level.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

## Overall system description
SpyVsSpy consists of one client and two servers. Both servers are node applications built using express. One server serves content such as the index.html for the client. The other server runs games and communicates with clients using sockets. The client is built using aframe.

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

The package.json contains some scripts that enables us to build the client and server. It also contains scripts that starts a node http server to serve files. We also have a node server that runs the game-logic using sockets. 

To build the client and server, issue these command: 

```
npm run buildSpyServer
npm run buildSpyClient
```

The commands above should start instances of webpack that builds .js files to the /dist/ folder using the files in src as source.

To be able to run a game on your local computer you can issue the following commands: 

```
npm run runSpygserver
npm run runSpyVsSpyContentServer
```

When both servers are running, open up chrome and type: https://localhost:8080/ 

You should see a room with options to change name, create & join games

## Built With

### Server

* [NodeJs](https://nodejs.org/en/) - Server environment
* [Socket.io](https://socket.io/) - Server-client game communication
* [Express](https://expressjs.com/) - Server

### Client

* [a-frame](https://aframe.io/) - Virtual reality web framework

## Authors

* **Kristofer Holmgren** - *Client and server code*
* **Mikael Vesavuori** - *Testing, 3d-models, Ideas*

## Troubleshooting
Send an mail to kristofer.holmgren@sogeti.se

## Acknowledgments

* Also many big thanks to the team behind [a-frame](https://aframe.io/)