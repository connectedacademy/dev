var assert = require('assert');
var testEnv = require('../test.env')

const APP_URL = testEnv.APP_URL;

describe('General tests', function() {
  it('does load page', function () {
    browser
      .url(APP_URL)
      .pause(2000);
      browser.saveScreenshot('./test/screenshots/loaded.png');
      assert(browser.getTitle().match(/Connected Academy/i));      
  });

});