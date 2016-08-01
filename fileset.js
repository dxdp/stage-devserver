/*jshint esnext : true */

var path = require('path')

function boxed(value) {
    return value === undefined || value === null ? []
    : Array.isArray(value) ? value
    : [value];
}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

class Fileset {
    constructor(include_paths, exclude_regexes) {
        console.log(include_paths)
        var resolved_include_paths = boxed(include_paths).map( (entry) => path.resolve(process.cwd(), entry) )
        this.include_paths = resolved_include_paths.getUnique()
        this.exclude_regexes = boxed(exclude_regexes)
    }

    contains(filename) {
        for (var re of this.exclude_regexes) {
            var regex = new RegExp(re)
            if (filename.match(regex)) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Fileset;
