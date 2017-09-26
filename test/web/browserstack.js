exports.config = {
    user: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
    key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
  
    updateJob: false,
    specs: [
      './test/specs/**/*.js'
    ],
    exclude: [],
  
    capabilities: [{
      'browserName' : 'Firefox',
      'browser_version' : '56.0 beta',
      'os' : 'Windows',
      'os_version' : '7',
      'resolution' : '1024x768'
    }],
  
    logLevel: 'verbose',
    coloredLogs: true,
    screenshotPath: './errorShots/',
    baseUrl: '',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    }
  }