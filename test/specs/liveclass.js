var assert = require('assert');
var testEnv = require('../test.env.js');
var moment = require('moment');
var fs = require('fs-extra');
fs.ensureDirSync('./test/screenshots/liveclass/');

const APP_URL = testEnv.APP_URL;

describe('Live Class', function () {
  it('Nagivates to it as logged in user', function () {
    browser.windowHandleMaximize();
    browser.url('https://api.connectedacademy.io/v1/auth/loginexistinguser/?account=' + testEnv.USER_ACCOUNT + '&psk=' + testEnv.PSK + '&callback=' + APP_URL);
    assert(browser.getTitle().match(/Connected Academy/i));
    browser.waitForExist('[name="continue-listening"]');
    // browser.pause(3000);
  });

  // it('Scrolls liveclass', () => {

  //   // Scroll to liveclass
  //   browser.scroll('[name="section-liveclass"]').pause(1000);
  //   // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-top.png');
  //   // Pause
  //   browser.pause(1000);
  //   // Assert section is visible
  //   browser.isVisible('[name="section-liveclass"]');
  //   // Assert action panel is visible
  //   browser.isVisible('[name="action-panel"]');
  // });

  // it('Plays and pauses media', () => {

  //   // Pause
  //   browser.pause(1000);
  //   // Play
  //   browser.click('[name="play-pause-button"]')
  //   // Pause
  //   // browser.pause(1000);
  //   // Play
  //   // browser.click('[name="play-pause-button"]')
  //   // Pause so scroll can take place
  //   browser.pause(5000);
  //   // // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-scrolling.png');
  // });

  // it('Creates Message', () => {

  //   // Pause
  //   browser.scroll('[name="section-liveclass"]').pause(1000);

  //   let ts = $$('.time-segment')[0];
  //   ts.click();

  //   browser.pause(500);

  //   let txt = 'This is a #test message from Selenium at ' + moment();

  //   $('textarea[name="name"]').click().keys(txt);

  //   $('.message-composer--footer > button').click().pause(3000);

  //   assert($('.single-message-wrapper .message-content').getText() == txt + ' #cainterpretation');

  //   // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-testmessage.png');
  // });

  // it('Creates Message', () => {

  //   // Pause
  //   browser.scroll('[name="section-liveclass"]').pause(1000);

  //   let ts = $$('.time-segment')[0];
  //   ts.click();

  //   browser.pause(500);

  //   let txt = 'This is a #test message from Selenium at ' + moment();

  //   $('textarea[name="name"]').click().keys(txt);

  //   $('.message-composer--footer > button').click().pause(3000);

  //   assert($('.single-message-wrapper .message-content').getText() == txt + ' #cainterpretation');

  //   // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-testmessage.png');
  // });

  it('Scrolls up and down a lot then makes another message', () => {

    //scroll to continue listening:
    $('[name="continue-listening"]').scroll(0,300);
    $('[name="continue-listening"]').click();

    browser.pause(2000);

    for (let i = 0; i < 5; i++) {

      //pick one randomly:
      let sblock = pickMessageBlock();
      // console.log(block);

      browser.elementIdLocation(sblock.ELEMENT).value.y - 50

      //scroll to it:
      browser.scroll(0, browser.elementIdLocation(sblock.ELEMENT).value.y - 50).pause(1000);
      browser.pause(500);
      browser.scroll(0, browser.elementIdLocation(sblock.ELEMENT).value.y - 30).pause(1000);
      browser.debug();
      //let the media play for a bit:
      // browser.click('[name="play-pause-button"]');

      browser.pause(5000);

      browser.click('[name="play-pause-button"]');

      //pick a block in the window:
      let block = pickMessageVisibleBlock(sblock);

      // let ts = $$('.time-segment')[0];
      block.click();

      browser.pause(500);

      let txt = 'This is a #test message from Selenium at ' + moment();

      $('textarea[name="composer-textarea"]').click().keys(txt);

      $('.message-composer--footer > .composer-actions > button').click();
      
      browser.pause(3000);

      assert($('.time-segment.peek .single-message-wrapper .message-content').getText() === `${txt } ${testEnv.HASHTAG}`);

      // Save screenshot
      browser.saveScreenshot('./test/screenshots/liveclass/liveclass-testmessage-'+i+'.png');

      browser.leftClick('#content-overlay',50,50).pause(200);
    }
  });

});

function pickMessageVisibleBlock(sblock) {

  // console.log(sblock);
  let time = parseInt(browser.elementIdAttribute(sblock.ELEMENT, 'data-top').value);
  // console.log(time);

  let inviewport = [];
  for (let i=1;i<2;i++)
  {
    // console.log(i);
    let isview = browser.isVisibleWithinViewport('[data-top="'+(time + (i*158))+'"]');
    // console.log('[data-top="'+(time + (i*158))+'"]');
    if (isview)
      inviewport.push('[data-top="'+(time + (i*158))+'"]');
  }

  console.log('inviewport');
  console.log(inviewport);
  console.log('inviewport');
  // browser.debug();

  //158px

  let block = $(`${_.sample(inviewport)}`);
  return block;
}

function pickMessageBlock() {
  let blocks = $$('.time-segment');

  let block = _.sample(blocks);
  // console.log(block);
  return block;
}