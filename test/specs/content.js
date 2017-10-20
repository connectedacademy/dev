var assert = require('assert');
var testEnv = require('../test.env')

var fs = require('fs-extra');
fs.ensureDirSync('./test/screenshots/content/');

const APP_URL = testEnv.APP_URL;
browser.url('https://api.connectedacademy.io/v1/auth/loginexistinguser/?account=' + testEnv.USER_ACCOUNT + '&psk=' + testEnv.PSK + '&callback=' + APP_URL);

describe('Content', function () {

  it('Opens and closes each content block', () => {


    let markdownlinks = $$('.markdown-link > .pure-button');

    for (let i = 0; i < markdownlinks.length; i++) {
      let block = $$('.markdown-link > .pure-button')[i];

      browser.scroll(0, browser.elementIdLocation(block.ELEMENT).value.y - 200);

      browser.elementIdClick(block.ELEMENT).pause(500);

      browser.saveScreenshot('./test/screenshots/content/content-deep-' + block.ELEMENT + '.png');

      browser.click('.previous-button').pause(1000);
    }
  });

  it('Opens and closes each homework block', () => {

    let markdownlinks = $$('[name="feedback-button"]');

    for (let i = 0; i < markdownlinks.length; i++) {
      let block = $$('[name="feedback-button"]')[i];

      browser.scroll(0, browser.elementIdLocation(block.ELEMENT).value.y - 200);

      browser.elementIdClick(block.ELEMENT).pause(500);

      browser.saveScreenshot('./test/screenshots/content/feedback-' + block.ELEMENT + '.png');

      browser.click('#previous-button').pause(1000);
    }
  });

  it('Opens and closes each 4c preview image', () => {

    let markdownlinks = $$('.md-thumbnail-row > a');

    for (let i = 0; i < markdownlinks.length; i++) {
      let block = $$('.md-thumbnail-row > a')[i];

      browser.scroll(0, browser.elementIdLocation(block.ELEMENT).value.y - 200);

      browser.elementIdClick(block.ELEMENT);

      browser.waitForExist('iframe');

      browser.saveScreenshot('./test/screenshots/content/4c-preview-' + i + '.png');

      browser.click('.previous-button').pause(1000);
    }
  });


  // it('opens additional content', () => {
  //   browser.pause(2000);
  //   // Scroll to intro
  //   browser.scroll('[name="section-intro"]').pause(1000);
  //   // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/intro-top.png');
  //   // Pause
  //   browser.pause(2000);
  //   // Assert section is visible
  //   browser.isVisible('[name="section-intro"]');
  //   // Click feedback button
  //   browser.click('[name="intro-markdown-link"]').pause(1000);
  //   // Check page loaded
  //   assert(browser.isVisible('[name="markdown-page"]'));
  // });

});