var assert = require('assert');
var testEnv = require('../test.env')

const APP_URL = testEnv.APP_URL;

describe('Drawer tests', function() {
  it('does load page', function () {
    browser
      .url(APP_URL)
      .pause(2000);
      browser.saveScreenshot('./test/screenshots/loaded.png');
      assert(browser.getTitle().match(/Connected Academy/i));      
  });

  it('does open left drawer', function () {

    // Open left drawer
    browser.click('[name="navigation-button"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/left-drawer-open.png');
    // Assert drawer is visible in view port
    browser.isVisibleWithinViewport('[name="left-drawer"]');
    // Close left drawer
    browser.click('[name="navigation-button"]').pause(1000);
  });

  it('navigates to about page', () => {

    // Open left drawer
    browser.click('[name="navigation-button"]').pause(1000);
    // Click drawer navigation item
    browser.click('[name="about-drawer-item"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/about-page.png');
    // Assert page is visible
    browser.isVisible('[name="about-page"]');
  });

  it('navigates to course page', () => {

    // Open left drawer
    browser.click('[name="navigation-button"]').pause(1000);
    // Click drawer navigation item
    browser.click('[name="course-drawer-item"]').pause(1000);
    // Save screenshot
    browser.saveScreenshot('./test/screenshots/course-page.png');
    // Assert page is visible
    browser.isVisible('[name="course-page"]');
  });

});