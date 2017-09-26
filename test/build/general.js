var assert = require('assert');

const APP_URL = 'http://localhost:8080'; // https://interpretation.connectedacademy.io

describe('Open CA', function() {
  it('does load page', function () {
    browser
      .url(APP_URL)
      .pause(3000);
      browser.saveScreenshot('./test/screenshots/init1.png');
      assert(browser.getTitle().match(/Connected Academy/i));      
  });

  // it('opens 4c banner', function () {
    
  //   browser.click('[name="4c-banner-bottom-right"]').pause(1000);
  //   assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Copyright/License');
    
  //   browser.click('[name="4c-banner-bottom-left"]').pause(1000);
  //   assert.equal(browser.element('[name="4c-banner-title"]').getText(), 'Copyright/License');
    
  //   browser.saveScreenshot('./test/screenshots/open4c.png');
  // });
});