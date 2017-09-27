var assert = require('assert');

const APP_URL = process.env.TEST_URL || 'https://interpretation.connectedacademy.io';

describe('General tests', function() {
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
    browser.pause(2000);
    // Assert section is visible
    browser.isVisible('[name="section-liveclass"]');
    // Assert action panel is visible
    browser.isVisible('[name="action-panel"]');
  });

  it('plays media', () => {

    // Play
    browser.click('[name="play-pause-button"]')
    // Pause so scroll can take place
    browser.pause(5000);
    // // Save screenshot
    browser.saveScreenshot('./test/screenshots/liveclass-scrolling.png');
  });


});