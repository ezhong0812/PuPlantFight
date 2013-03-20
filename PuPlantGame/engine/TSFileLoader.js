var fs = require('fs');
exports.TSDoFile = function ( path ) {
    try {
        var data = fs.readFileSync(path , "utf-8");
        eval(data);
    } catch(error) {
        console.log("Error! = " + path + " " + error);
    } finally {
        console.log("OK! = " + path);
    }
}