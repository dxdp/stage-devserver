/*jshint esnext : true */

var fs = require('fs')
var path = require('path')

class DirectoryWalker {
    constructor(dir) {
        this.dir = dir;
    }

    files(match, callback) {
        this.walk(this.dir, function(error, files) {
            if (error) callback(error);
            else callback(null, files.filter( function(item) {
                return item.match(match);
            }));
        });
    }

    walk(dir, done) {
        var results = [];
        var walker = this;
        fs.readdir(dir, function(err, list) {
            if (err) { return done(err); }
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function(file) {
                file = path.resolve(dir, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        walker.walk(file, function(err, res) {
                            results = results.concat(res);
                            if (!--pending) done(null, results);
                        });
                    } else {
                        results.push(file);
                        if (!--pending) done(null, results);
                    }
                });
            });
        });
    }
}

module.exports = DirectoryWalker;
