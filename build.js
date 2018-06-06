const fs = require('fs')
const path = require('path')

const config = require('./config').config

const buildDb = () => {
  try {
    let db = {}
    const files = fs.readdirSync(path.join(__dirname, config.baseDirectory, config.collectionsDirectory))
    files.forEach(function(file, index) {
      var fileContent = fs.readFileSync(
        path.join(__dirname, config.baseDirectory, config.collectionsDirectory, file),
        'utf8'
      )
      const json = JSON.parse(fileContent)
      for (var prop in json) {
        db[prop] = json[prop]
      }
      fs.writeFileSync(path.join(__dirname, config.baseDirectory, config.dbFile), JSON.stringify(db))
    })
  } catch (error) {
    console.log(error)
  }
}

buildDb()

fs.watch(path.join(__dirname, config.baseDirectory, config.collectionsDirectory), (e, file) => {
  if (file) {
    buildDb()
  }
})
