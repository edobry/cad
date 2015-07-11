var path = require("path"),

    fs = require("fs"),
    http = require("http"),
    
    _ = require("highland");

var relativePath = function(fileName) {
    return path.join(__dirname, fileName);
};

var readFile = _.wrapCallback(fs.readFile);
var readDir = _.wrapCallback(fs.readDir);

var loadFunctions = function() {
    return readDir(relativePath("functions")).map(readFile)
        .map(/* implement constructing object here */);
};

var serveFile = function(fileName) {
    return function(req, res) {
        var filePath = relativePath(fileName);
        var size = fs.statSync(filePath).size;

        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Length": size
        });

        fs.createReadStream(filePath).pipe(res);
    };
};

var routes = {
    "alex.html": serveFile("alex.html"),
    "functions": function() {
        //use loadFunctions
    }
};

var server = http.createServer(function(req, res) {
    var filePath = path.join(__dirname, "alex.html");
    var size = fs.statSync(filePath).size;

    res.writeHead(200, {
        "Content-Type": "text/html",
        "Content-Length": size
    });

    fs.createReadStream(filePath).pipe(res);
});
server.listen(80);