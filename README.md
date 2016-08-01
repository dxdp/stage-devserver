# stage-devserver

stage-devserver is a node module used to feed .stage files from the source directory over a basic web server. The native application can use the StageDefinition factory for the iphone simulator target that uses this web server running on localhost. By reading these files over the wire once the application is already loaded, restyling without having to rebuild application bundle becomes possible.

## Installation

Follow node semantics. Clone the repo and issue the command

	npm install

## Start up the server

To start the server, pass the source directory to npm start. For example:

	npm start ~/workspace/AwesomeProject/StageFiles

Leave the server running and modify view styles/properties while the application is still running.
