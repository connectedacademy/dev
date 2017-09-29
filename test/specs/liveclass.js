var assert = require('assert');
var testEnv = require('../test.env')

const APP_URL = testEnv.APP_URL;

describe('General tests', function () {
  it('does load page', function () {
    browser
      .url(APP_URL)
      .pause(2000);
    browser.saveScreenshot('./test/screenshots/loaded.png');
    assert(browser.getTitle().match(/Connected Academy/i));
  });

  it('navigates to liveclass', () => {

    // Scroll to liveclass
    browser.scroll('[name="section-liveclass"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/liveclass-top.png');
    // Pause
    browser.pause(1000);
    // Assert section is visible
    browser.isVisible('[name="section-liveclass"]');
    // Assert action panel is visible
    browser.isVisible('[name="action-panel"]');
  });

  it('plays media', () => {

    // Pause
    browser.pause(1000);
    // Play
    browser.click('[name="play-pause-button"]')
    // Pause
    browser.pause(1000);
    // Play
    browser.click('[name="play-pause-button"]')
    // Pause so scroll can take place
    browser.pause(5000);
    // // Save screenshot
    browser.saveScreenshot('./test/screenshots/liveclass-scrolling.png');
  });

});