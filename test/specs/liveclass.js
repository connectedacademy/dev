var assert = require('assert');
var testEnv = require('../test.env.js');
var moment = require('moment');
var fs = require('fs-extra');
fs.ensureDirSync('./test/screenshots/liveclass/');

const APP_URL = testEnv.APP_URL;

describe('Live Class', function () {
  it('Nagivates to it', function () {
    browser.url('https://api.connectedacademy.io/v1/auth/loginexistinguser/?account='+testEnv.USER_ACCOUNT+'&psk='+testEnv.PSK+'&callback=' + APP_URL);
    assert(browser.getTitle().match(/Connected Academy/i));
  });

  it('Scrolls liveclass', () => {

    // Scroll to liveclass
    browser.scroll('[name="section-liveclass"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/liveclass/liveclass-top.png');
    // Pause
    browser.pause(1000);
    // Assert section is visible
    browser.isVisible('[name="section-liveclass"]');
    // Assert action panel is visible
    browser.isVisible('[name="action-panel"]');
  });

  it('Plays media', () => {

    // Pause
    browser.pause(1000);
    // Play
    browser.click('[name="play-pause-button"]')
    // Pause
    // browser.pause(1000);
    // Play
    // browser.click('[name="play-pause-button"]')
    // Pause so scroll can take place
    browser.pause(5000);
    // // Save screenshot
    browser.saveScreenshot('./test/screenshots/liveclass/liveclass-scrolling.png');
  });

  it('Creates Message', () => {
    
    // Pause
    browser.scroll('[name="section-liveclass"]').pause(1000);

    let ts = $$('.time-segment')[0];
    ts.click();

    browser.pause(500);

    let txt = 'This is a test message from Selenium at ' + moment();

    $('textarea[name="name"]').click().keys(txt);

    $('.message-composer--footer > button').click().pause(3000);

    assert($('.single-message-wrapper .message-content').getText() == txt + ' #cainterpretation');

    // Save screenshot
    browser.saveScreenshot('./test/screenshots/liveclass/liveclass-testmessage.png');
  });

});