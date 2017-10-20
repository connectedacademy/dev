var assert = require('assert');
var testEnv = require('../test.env.js')
var fs = require('fs-extra');
fs.ensureDirSync('./test/screenshots/fourcorners/');

var APP_URL = testEnv.APP_URL;

describe('FourCorners', function() {
  it('Page Loads Correctly', function () {
    browser
      .url(APP_URL)
      .pause(2000);
      browser.saveScreenshot('./test/screenshots/fourcorners/loaded.png');
      assert(browser.getTitle().match(/Connected Academy/i));      
  });

  it('Opens 4c banner', function () {

    // Open bottom right corner
    browser.click('[name="4c-banner-bottom-right"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Copyright/License');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-br.png');

    // Open bottom left corner
    browser.click('[name="4c-banner-bottom-left"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Backstory');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-bl.png');

    // Open top left corner
    browser.click('[name="4c-banner-top-left"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Image Context');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-tl.png');

    // Open top right corner
    browser.click('[name="4c-banner-top-right"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Links');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-tr.png');

    // Close current corner
    browser.click('[name="4c-banner-top-right"]');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-minimize.png');

    // Close current corner
    browser.click('[name="4c-banner-bottom-right"]').pause(500);
    browser.click('[name="4c-banner-bottom-right"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-minimize.png');
  });

  it('Opens 4c page', function () {
    
    // Open bottom right corner
    browser.click('[name="4c-banner-bottom-right"]');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-learn-more.png');

    // Open 4c learn more
    browser.click('[name="4c-learn-more"]').pause(3000);
    
    // Check page loaded
    browser.isVisible('[name="fourcorners-page"]');

    // Save screenshot
    browser.saveScreenshot('./test/screenshots/fourcorners/4c-onboarding-page.png');

    browser.scroll(0,2000);

    browser.saveScreenshot('./test/screenshots/fourcorners/4c-onboarding-scroll.png');

    browser.scroll(0,0);

    // Return to previous page
    browser.click('[name="previous-button"]');
  });

});