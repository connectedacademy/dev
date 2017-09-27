var assert = require('assert');
var testEnv = require('../test.env')

const APP_URL = testEnv.APP_URL;

describe('Content tests', function() {
  it('does load page', function () {
    browser
      .url(APP_URL)
      .pause(2000);
      browser.saveScreenshot('./test/screenshots/loaded.png');
      assert(browser.getTitle().match(/Connected Academy/i));      
  });

  it('opens additional content', () => {
    browser.pause(2000);
    // Scroll to intro
    browser.scroll('[name="section-intro"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/intro-top.png');
    // Pause
    browser.pause(2000);
    // Assert section is visible
    browser.isVisible('[name="section-intro"]');
    // Click feedback button
    browser.click('[name="intro-markdown-link"]').pause(1000);
    // Check page loaded
    assert(browser.isVisible('[name="markdown-page"]'));
  });

});