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

  it('opens feedback', () => {

    // Scroll to feedback
    browser.scroll('[name="section-feedback"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/feedback-top.png');
    // Pause
    browser.pause(2000);
    // Assert section is visible
    browser.isVisible('[name="section-feedback"]');
    // Click feedback button
    browser.click('[name="feedback-button"]').pause(3000);
    // Check page loaded
    browser.isVisible('[name="feedback-page"]');
  });

});