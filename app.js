var newrelic = require('newrelic')
// newRelic instrument
newrelic.instrument({
  moduleName: 'express',
  onRequire: function instrumentMyCustomModule (data) {
    console.log('data')
  },
  onError: function myErrorHandler (err) {
    // Uh oh! Our instrumentation failed, lets see why:
    console.error(err.message, err.stack)

    // Let's kill the application when debugging so we don't miss it.
    process.exit(-1)
  }
})
// require('newrelic')

let app = require('express')()
let bodyParser = require('body-parser')
require('dotenv').config()
let cors = require('cors')

/* GLOBAL LIBRARY DECLARATIONS */
global._ = require('underscore')
global.q = require('q')
global.request = require('request')
global.fs = require('fs')
global.path = require('path')
global.config = require('./config/config.js')

const BASE_URL = '/pp-api/api'
// const TAG = path.basename(__filename) + '-----> '
const args = process.argv

global.homeDir = __dirname

// This is written just to check whether we are running test cases or not.
if (args.length > 3) {
  global.istest = true
}
global.platform = (process.env && process.env.PLATFORM) ? process.env.PLATFORM : 'LOCAL' // 'LOCAL','STAGE','UAT'

let corsOptions = {
  origin: function (origin, callback) {
    if (config.whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  credentials: true
}
app.use(cors(corsOptions))

app.use(bodyParser.raw({
  limit: '100mb'
}))

app.use(bodyParser.json({
  limit: '100mb'
}))

app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true,
  parameterLimit: 1000000
}))

app.get(BASE_URL + '/ping', function (req, res) {
  // For creating a transaction. Please refer https://docs.newrelic.com/docs/agents/nodejs-agent/api-guides/nodejs-agent-api#add-custom-param

  newrelic.setTransactionName('ping')
  newrelic.addCustomAttributes({ test: 'value', test2: 'value2' })
  newrelic.noticeError('undefined exception', { test: 'value' })
  newrelic.shutdown({ collectPendingData: true }, function (data) {
    console.log('data')
  })
  res.status(200).send('Welcome To HomePage')
})
// 27/Feb/2017
app.get(BASE_URL + '/getpingresponse', require('./api/controllers/ping').getPingResponse)

app.use((err, req, res, next) => {
  console.log('-----Something broke!---', err)
  res.status(500).send('Something broke!')
})

/* 404 ROUTE NOT FOUND */
app.get('*', (req, res) => {
  console.log('no route found,throwing 404 error.' + req.url)
  res.status(404).send({
    code: 404,
    error: '404 PAGE not found >' + req.url + '<<'
  })
})
/* SERVER START */
let port = process.env.PP_API_PORT
global.port = port
let server = app.listen(port)
server.timeout = 600000
module.exports = exports
module.exports = app // for testing

console.log('API is running on port: ' + port)
console.log('try this: curl http://localhost:' + port + BASE_URL + '/ping')

process
  .on('unhandledRejection', function (reason, p) {
    console.error('Unhandled Rejection at Promise', reason, p)
  })
  .on('uncaughtException', function (err) {
    console.log('app uncaughtException: ', err)
  })
