import express from 'express'
import bodyParser from 'body-parser'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'
import users from './users'

const app = express()

// Models
app.set('models', require('./models.js'))

// API routes
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/users', users)

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

const server = app.listen(8081, '127.0.0.1', function() {
  const host = server.address().address
  const port = server.address().port
  console.log(`pixelect listening at http://${host}:${port}`)
})
