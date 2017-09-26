var assert = require('assert');

const APP_URL = 'http://localhost:8080'; // https://interpretation.connectedacademy.io

describe('Login flow', function() {
  it('Does perform login loop', function () {
    browser
      .url(APP_URL)
      .pause(10000);
    browser
      .click('[name="nav-login-button"]')
      .pause(1000);
    browser
      .saveScreenshot('./test/screenshots/auth/login-modal.png');
    browser
      .click('[name="twitter-login-button"]')
      .pause(2000);
    browser
      .element('[name="session[username_or_email]"]')
      .setValue('edjenkinsca')
      .element('[name="session[password]"]')
      .setValue('tkY8ccvrShSefPGI');      
      browser
      .click('#allow')
      .pause(10000);
    
  });
});