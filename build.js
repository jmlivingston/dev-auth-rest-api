var fs = require('fs');
var configHelper = require('./config.js');

(() => {
  try {
    var config = configHelper.getConfig();
    var db = {}
    var files = fs.readdirSync(config.baseDirectory + '/' + config.collectionsDirectory);
    files.forEach(function (file, index) {
      var fileContent = fs.readFileSync(config.baseDirectory + '/' + config.collectionsDirectory + '/' + file, 'utf8');
      var json = JSON.parse(fileContent);
      for (var prop in json) {
        db[prop] = json[prop];
      }
      fs.writeFileSync(config.baseDirectory + '/' + config.dbFile, JSON.stringify(db));
    });
  }
  catch (error) {
    console.log(error);
  }
})()