var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROUTE: `"${process.env.API_ROUTE || "http://ca.local:3000/v1"}"`
})
