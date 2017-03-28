'use strict'

const path = require('path')
const _ = require('lodash')

var env = process.env.NODE_ENV || 'development'
env = env.toLowerCase()

var all = {
  env: process.env.NODE_ENV,
  root: path.normalize(path.join(__dirname, '/../..')),
  elasticsearch: {
    host: 'http://localhost:9200',
    httpAuth: 'username:pass'
  }
}
module.exports = _.merge(all, require('./' + env + '.js') || {})
