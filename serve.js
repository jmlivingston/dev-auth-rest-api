const enableDestroy = require('server-destroy')
const fs = require('fs')
const path = require('path')

const authRoutes = require('./auth-routes')
const config = require('./config').config
const jsonServer = require('json-server')

let server = jsonServer.create()

let app = null

const startServer = () => {
  try {
    const port = process.env.PORT || config.port
    server = jsonServer.create()
    server.use(jsonServer.defaults())
    server.use(jsonServer.bodyParser)
    server.use(authRoutes)
    server.use(jsonServer.router(path.join(__dirname, config.baseDirectory, config.dbFile)))
    app = server.listen(port, function() {
      console.log('API running at: ' + port)
    })
    enableDestroy(app)
  } catch (error) {
    console.log(error)
  }
}

startServer()

const watchDirectories = [
  path.join(__dirname, config.baseDirectory, config.dbFile),
  path.join(__dirname, 'auth-routes.js'),
  path.join(__dirname, 'security.json')
]
watchDirectories.forEach(directory => {
  fs.watch(directory, (e, file) => {
    if (file) {
      app.destroy()
      startServer()
    }
  })
})
