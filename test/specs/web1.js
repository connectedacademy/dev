var assert = require('assert');

describe('Open CA', function() {
  it('does load page', function () {
    browser
      // .url('https://interpretation.connectedacademy.io')
      .url('http://localhost:8080')
      .pause(3000);
      browser.saveScreenshot('./test/screenshots/init1.png');
      assert(browser.getTitle().match(/Connected Academy/i));      
  });

  it('opens 4c banner', function () {
    //   .setValue('*[name="q"]','BrowserStack\n')
    browser.click('[name="4c-banner-bottom-right"]');
    browser.element('[name="4c-banner-title"]').waitForText('Copyright/License',3000);
    
    browser.saveScreenshot('./test/screenshots/open4c.png');      
  });
});