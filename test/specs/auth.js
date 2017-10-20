var assert = require('assert');
var testEnv = require('../test.env.js')
var fs = require('fs-extra');
fs.ensureDirSync('./test/screenshots/auth/');

const APP_URL = testEnv.APP_URL;

describe('Authentication', function() {
  it('Does login using existing account and open profile', function () {
    browser
      .url('https://api.connectedacademy.io/v1/auth/loginexistinguser/?account='+testEnv.USER_ACCOUNT+'&psk='+testEnv.PSK+'&callback=' + APP_URL)
    browser.saveScreenshot('./test/screenshots/auth/init.png');

    browser.click('.profile-image').pause(500);
    
    assert(browser.isVisible('.drawer'));

    browser.saveScreenshot('./test/screenshots/auth/sidebar.png');

    browser.click(100,100).pause(500);

    browser.saveScreenshot('./test/screenshots/auth/close-sidebar.png');
  });

  it('Does click all hints', function () {

    browser.click('.profile-image').pause(500);
    
    assert(browser.isVisible('.drawer'));

    browser.saveScreenshot('./test/screenshots/auth/sidebar.png');

    browser.click(100,100).pause(500);

    browser.saveScreenshot('./test/screenshots/auth/close-sidebar.png');
  });

});