var args = require('minimist')(process.argv.slice(2), {
    string: 'exclude',
    alias: { x: 'exclude' }
});

if (args._.length == 0) {
    args._.push(process.cwd());
}

var Fileset = require('./fileset')
var Program = require('./program')

var serveFiles = new Fileset(args._, args.exclude)
console.dir(serveFiles);
new Program().main(serveFiles);
