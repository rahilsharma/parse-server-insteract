var cluster = require('cluster');
BUILD_TYPE = "DEBUG";
if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;
    console.log('Master cluster setting up ' + numWorkers + ' workers...');
    for (var i = 0; i < 1; i++) {
        cluster.fork();
    }
    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
}
else {
    require( "console-stamp" )( console, { pattern : "dd/mmm/yyyy HH:MM:ss" } );
    var path = require('path');
    var express = require('express');
    var app = express();
    var logger = require('morgan');
    var ParseServer = require('parse-server').ParseServer;
    var ParseDashboard = require('parse-dashboard');
    global.appRootE = path.resolve(__dirname);
    app.use(logger('[:date[clf]] [:method] :url :status :res[content-length] - :response-time ms'));
    var cloudCodeDirectory = appRootE + '/cloud/main.js';
    var allowInsecureHTTP = true;    //keep it as true for testing
    var databaseURI = "mongodb://localhost:27017/Rahil";
    var appId = "12345678910";
    var masterKey = "abcdefghijklmnopqrstuvwxyz";
    var clientKey = "someclientkey";
    var restAPIKey = "somerestapikey";
    var javascriptKey = "somejavascriptkey";
    var serverURL = "http://127.0.0.1:1338/parse";
    var dashboardUser = "rahil"; var dashboardPass = "rahil";
    var dashboardAppName = "Rahil Demo App";
    var api = new ParseServer({
        // Debug server
        databaseURI: databaseURI,
        cloud: cloudCodeDirectory,
        appId: appId,
        masterKey: masterKey,
        clientKey:clientKey,
        restAPIKey: restAPIKey,
        javascriptKey: javascriptKey,
        serverURL: serverURL,
        databaseOptions: {
            poolSize: 40
        }
    });
    var dashboard = new ParseDashboard({
        "apps": [
            {
                "serverURL": serverURL,
                "appId": appId,
                "masterKey": masterKey,
                "appName": dashboardAppName
            }
        ],"users": [
            {
                "user":dashboardUser,
                "pass":dashboardPass
            }
        ],
        "useEncryptedPasswords": false
    },allowInsecureHTTP);
    app.get('/parse/config', function (req, res, next) {
        var arr = {
            "params": {
               text:"This is the config object !!!!"
            }
        };
        res.status(200).json(arr);
    });
    app.use('/parse', api);
    app.use('/dashboard', dashboard);
    var port = process.env.PORT || 1338;
    app.listen(port, function () {
        console.log('parse-server-example running on port ' + port + '.');
    });

}
