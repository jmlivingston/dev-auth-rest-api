var authRoutes = require('./auth-routes');
var configHelper = require('./config.js');
var jsonServer = require('json-server');
var opn = require('opn');

function activate() {
    try {
        var argumentError = 'Error: port and env arguments are required. Example: npm run serve -- port:3001 env:dev1';
        var config = configHelper.getConfig();
        if (config.port && config.env) {
            var server = jsonServer.create();
            var url = 'http://localhost:' + config.port;
            server.use(jsonServer.defaults());
            server.use(require('./auth-routes'));
            server.use(jsonServer.router(config.baseDirectory + '/' + config.env + '/' + config.dbFile));
            server.listen(config.port, function () {
                console.log('Dev API running at: ' + url);
                opn(url);
            });
            process.on('SIGINT', function () {
                process.exit();
            });
        }
        else {
            throw argumentError;
        }
    }
    catch (error) {
        console.log(error);
    }
}

activate();
