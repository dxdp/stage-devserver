/*jshint esnext : true */
var DirectoryWalker = require('./dwalker')
var Server = require('./server')
var Fileset = require('./fileset')
var chokidar = require('chokidar')
var colors = require('colors');

var STAGE_FILE_MATCH = /\.stage$/;

class Program {
	main(fileset) {
		this.fileset = fileset
		console.log('** Starting Stage development server');
		for (var dir of fileset.include_paths) {
			var walker = new DirectoryWalker(dir);
			walker.files(STAGE_FILE_MATCH, this.processInitialFiles.bind(this));
		}
	}

	processInitialFiles(error, files) {
		var fileset = this.fileset;
		files = files.filter( (item) => fileset.contains(item) )
		// Build the initial request mapping from the existing files
		var requestMapping = {};
		this.server = new Server();
		files.forEach( this.server.addRequestMapping.bind(this.server) );
		this.startServer();
		this.startFileWatcher();
	}

	startServer() {
		// Spin up the server
		var self = this;
		var server = this.server;
		server.listen(34567, function() {
			console.log("Listening on port 34567. Now serving the following resources:".cyan);
			console.log(server.requestMapping);
		});
		server.on('404', function(resource) {
			console.log('404'.red, resource);
		});
		server.on('200', function(resource) {
			console.log('200'.green, resource);
		});
	}

	startFileWatcher() {
		// Hand the server new files that become available
		var server = this.server, fileset = this.fileset;
		for (var dir of fileset.include_paths) {
			var fileWatcher = chokidar.watch(dir, {
				persistent: true
			});
			fileWatcher.on('add', function(path) {
				if (path.match(STAGE_FILE_MATCH) && fileset.contains(path) && server.addRequestMapping(path)) {
					console.log('now serving file:', path);
				}
			});
			fileWatcher.on('unlink', function(path) {
				if (server.removeRequestMapping(path)) {
					console.log('no longer serving', path);
				}
			});
		}
	}
}

module.exports = Program;
