exports.config = {
    
    services: ['sauce'],
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    // sauceConnect: true,
  
    updateJob: false,
    specs: [
      // './test/specs/**/*.js'
      '.\test\specs\fourcorners.js'
    ],
    exclude: [],
  
    capabilities: [
      // {
      //   'browserName': 'Firefox',
      //   'browser_version': '56.0 beta',
      //   'os': 'Windows',
      //   'os_version': '7',
      //   'resolution': '1024x768'
      // },
      {
        'browserName': 'Chrome',
        'browser_version': '60.0',
        'os': 'OS X',
        'os_version': 'Sierra',
        'resolution': '1024x768'
      },
      // {
      //   'browserName': 'IE',
      //   'browser_version': '11.0',
      //   'os': 'Windows',
      //   'os_version': '7',
      //   'resolution': '1024x768'
      // },
      // {
      //   'browserName': 'Edge',
      //   'browser_version': '15.0',
      //   'os': 'Windows',
      //   'os_version': '10',
      //   'resolution': '1024x768'
      // },
      // {
      //   'device': 'Google Pixel',
      //   'realMobile': 'true',
      //   'os_version': '8.0',
      // },
      // {
      //   'device': 'Samsung Galaxy S6',
      //   'realMobile': 'true',
      //   'os_version': '5.0',
      // }
    ],
  
    logLevel: 'verbose',
    coloredLogs: true,
    screenshotPath: './test/errorShots/',
    baseUrl: 'https://interpretation.connectedacademy.io',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    networkLogs: true,
    
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd'
    }
  }