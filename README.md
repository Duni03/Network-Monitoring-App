# Network-Monitoring-App

## Setup

Add your Mongo Server in ../BackEnd/server.js and in Monitor.py

To run this App, install it locally using npm:
For Front End
```
$ cd ../FrontEnd
$ npm install
$ npm start
```
For Back End
```
$ cd ../BackEnd
$ npm install
$ node server.js
```
For Core Monitoring
You Require tshark (with Npcap in Windows)
```
$ pip install pyshark
$ pip install pymongo
$ python Monitor.py
```
