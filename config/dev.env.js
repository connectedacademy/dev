const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROUTE: `"${process.env.API_ROUTE || 'http://localhost:3000/v1'}"`,
});
