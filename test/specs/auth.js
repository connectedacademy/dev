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

    $('#content-overlay').click().pause(500);

    browser.saveScreenshot('./test/screenshots/auth/close-sidebar.png');
  });

  it('Does click all hints', function () {
    browser.refresh().pause(4000);
    let markdownlinks = $$('.onnboarding-prompt > .dismiss-button');
    // console.log(markdownlinks);
    for (let i = 0; i < markdownlinks.length; i++) {
        let block = $$('.onnboarding-prompt > .dismiss-button')[0];

        // console.log(block);

        browser.scroll(0, browser.elementIdLocation(block.ELEMENT).value.y-50).pause(500);

        browser.elementIdClick(block.ELEMENT).pause(500);
        // assert(!browser.elementIdDisplayed(block.ELEMENT));
    }

    browser.saveScreenshot('./test/screenshots/auth/dismiss-onboarding.png');
  });

});