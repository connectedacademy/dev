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

  it('opens 4c banner', function () {

    // Open bottom right corner
    browser.click('[name="4c-banner-bottom-right"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Copyright/License');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-br.png');

    // Open bottom left corner
    browser.click('[name="4c-banner-bottom-left"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Backstory');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-bl.png');

    // Open top left corner
    browser.click('[name="4c-banner-top-left"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Image Context');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-tl.png');

    // Open top right corner
    browser.click('[name="4c-banner-top-right"]');
    // Check text
    assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Links');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-tr.png');

    // Close current corner
    browser.click('[name="4c-banner-top-right"]');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-minimize.png');

    // Close current corner
    browser.click('[name="4c-minimize"]');
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-minimize.png');
  });

  it('opens 4c page', function () {
    
    // Open bottom right corner
    browser.click('[name="4c-banner-bottom-right"]').pause(1000);

    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-learn-more.png');

    // Open 4c learn more
    browser.click('[name="4c-learn-more"]').pause(3000);
    
    // Check page loaded
    browser.isVisible('[name="fourcorners-page"]');

    // Save screenshot
    browser.saveScreenshot('./test/screenshots/4c-onboarding-page.png');

    // Return to previous page
    browser.click('[name="previous-button"]');
  });

});