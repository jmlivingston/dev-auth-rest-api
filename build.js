var fs = require('fs');
var configHelper = require('./config.js');

function activate() {
    try {
        var argumentError = 'Error: env argument is required. Example: npm run serve -- port:3001 env:dev1';
        var config = configHelper.getConfig();
        if (config.env) {
            var db = {}
            var files = fs.readdirSync(config.baseDirectory + '/' + config.env + '/' + config.collectionsDirectory);
            files.forEach(function (file, index) {
                var fileContent = fs.readFileSync(config.baseDirectory + '/' + config.env + '/' + config.collectionsDirectory + '/' + file, 'utf8');
                var json = JSON.parse(fileContent);
                for (var prop in json) {
                    db[prop] = json[prop];
                }
                fs.writeFileSync(config.baseDirectory + '/' + config.env + '/' + config.dbFile, JSON.stringify(db));
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