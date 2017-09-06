import express from 'express'
import bodyParser from 'body-parser'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'
import session from 'express-session'
import users from './users'
import photos from './photos'
import groups from './groups'
import votes from './votes'
import token from './token'

const app = express()

// Models
app.set('models', require('./models.js'))

// AWS configuration
var Minio = require('minio')
var s3Client = new Minio.Client({
  endPoint: process.env.PIXELECT_AWS_ENDPOINT,
  accessKey: process.env.PIXELECT_AWS_ACCESSKEY,
  secretKey: process.env.PIXELECT_AWS_SECRETKEY,
  secure: true,
})
app.set('s3', s3Client)

// API routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Session
app.use(
  session({
    secret: process.env.PIXELECT_SESSION_SECRETKEY,
    saveUninitialized: false,
  })
)

// CSRF
app.use(require('csurf')())

app.use('/token', token)
app.use('/users', users)
app.use('/photos', photos)
app.use('/groups', groups)
app.use('/votes', votes)

// Webpack bundle
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'))
} else {
  const compiler = webpack(webpackConfig)

  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
  })

  const hotMiddleware = webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
  })

  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    })
  })

  app.use(devMiddleware)
  app.use(hotMiddleware)
}

// Static content
app.use(express.static('static'))

if (process.env.NODE_ENV === 'production') {
	const server = app.listen(3000, function() {
	  const host = server.address().address
	  const port = server.address().port
	  console.log(`pixelect listening at http://${host}:${port}`)
	})
} else{
	const server = app.listen(8081, '127.0.0.1', function() {
	  const host = server.address().address
	  const port = server.address().port
	  console.log(`pixelect listening at http://${host}:${port}`)
	})
}
