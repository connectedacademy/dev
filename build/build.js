require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf');
var fs = require('fs');

if (process.env.API_ROUTE) {
  console.log(chalk.cyan(`  API route set - ${process.env.API_ROUTE}`))
} else {
  console.log(chalk.red(`  There is a configuration issue!`))
  console.log(chalk.red(`  Please pass 'API_ROUTE' environment variable.`))
  return false
}

let package_version = require('../package.json');

console.log(`SETTING VERSION TO ${package_version.version}\n`);

let settings = fs.readFileSync('src/config/index.js').toString();
let vpattern = /version: '(.*)'/;
let bpattern = /built: '(.*)'/;

settings = settings.replace(vpattern, `version: '${package_version.version}'`);
settings = settings.replace(bpattern, `built: '${new Date().toLocaleString()}'`);

fs.writeFileSync('src/config/index.js', settings);

var spinner = ora('  Building Connected Academy...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
