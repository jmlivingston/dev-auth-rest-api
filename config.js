module.exports = {
    getConfig: function () {
        var config = {
            baseDirectory: './data',
            dbFile: 'db.json',
            collectionsDirectory: 'collections',
            clientId: 'dev-api-id',
            clientSecret: 'dev-api-secret'
        }
        var argumentError = '***Error: port and env arguments are required. Example: npm run [SCRIPT_NAME] -- port:3001 env:dev1';
        for (var i = 0; i < process.argv.length; i++) {
            if (process.argv[i].indexOf(':') !== -1) {
                var configValues = process.argv[i].split(':');
                if(configValues[0] === 'env' || configValues[0] === 'port') {
                    config[configValues[0]] = configValues[1];
                }
            }
        }
        if(!config.env || !config.port) {
            throw argumentError + '\r\n***Arguments: ' + JSON.stringify(process.argv);
        }
        return config;
    }
}
