/*jshint esnext : true */
var fs = require('fs');
var http = require('http');

var PATH_SUFFIX_REGEX = /(\/[^\/]*)$/;

var EventEmitter = require('events').EventEmitter;
class Server extends EventEmitter {
	constructor() {
		super();
		this.requestMapping = {};
		this.server = http.createServer( this.handleRequest.bind(this) );
	}

	listen() {
		// forward call
		this.server.listen.apply(this.server, arguments);
	}

	handleRequest(request, response) {
		var resource = request.url.toLowerCase();
		if (!this.requestMapping[resource]) {
			response.statusCode = 404;
			response.end();
			this.emit('404', resource);
		} else {
			var read = fs.createReadStream(this.requestMapping[resource]);
			read.pipe(response);
			read.resume();
			this.emit('200', resource);
		}
	}

	addRequestMapping(path) {
		var entry = this.requestMappingEntryForPath(path);
		if (!this.requestMapping[entry.key]) {
			this.requestMapping[entry.key] = entry.value;
			return true;
		}
		return false;
	}

	removeRequestMapping(path) {
		var keys = Object.keys(this.requestMapping);
		for (var i = 0; i < keys.length; i++) {
			if (this.requestMapping[keys[i]] === path) {
				delete this.requestMapping[keys[i]];
				return true;
			}
		}
		return false;
	}

	requestMappingEntryForPath(path) {
		return { key: path.match(PATH_SUFFIX_REGEX)[1].toLowerCase(),
				 value: path };
	}

}

module.exports = Server;
