const fs = require('fs-extra')
const assert = require('assert')
const Moment = require('moment-mini')
const _sample = require('lodash/sample')
const chai = require('chai')
const chaiWebdriver = require('chai-webdriverio').default

const testEnv = require('../test.env.js')

const LandingPageObject = require("../objects/LandingPageObject.js")
const SchedulePageObject = require("../objects/SchedulePageObject.js")
const ClassPageObject = require("../objects/ClassPageObject.js")

const CREATE_MESSAGE_COUNT = 20

fs.ensureDirSync('./test/screenshots/liveclass/')

chai.use(chaiWebdriver(browser))

describe('Live Class', function () {

  var landingPage;
  var classPage;
  var schedulePage;
  
  before(function () {
    landingPage = new LandingPageObject()
    classPage = new ClassPageObject()
    schedulePage = new SchedulePageObject()
  })

  it('Nagivates to it as logged in user', function () {
    browser.windowHandleMaximize()
    browser.url('https://api.connectedacademy.io/v1/auth/loginexistinguser/?account=' + testEnv.USER_ACCOUNT + '&psk=' + testEnv.PSK + '&callback=' + testEnv.APP_URL)
    browser.url(testEnv.APP_URL)
    assert(browser.getTitle().match(/Connected Academy/i))
  })

  // it('Views first class from the schedule', () => {

  //   $(landingPage.getStartedButton).click()

  //   browser.pause(1000)

  //   browser.click(schedulePage.firstClass)

  // })

  // it('Scrolls liveclass', () => {

  //   // Scroll to liveclass
  //   browser.scroll(classPage.sectionLiveclass).pause(1000)
  //   // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-top.png')
  //   // Pause
  //   browser.pause(1000)
  //   // Assert section is visible
  //   browser.isVisible(classPage.sectionLiveclass)
  //   // Assert action panel is visible
  //   browser.isVisible(classPage.actionPanel)
  // })

  // it('Plays and pauses media', () => {

  //   // Pause
  //   browser.pause(1000)
  //   // Play
  //   browser.click(classPage.playPauseButton)
  //   // Pause
  //   // browser.pause(1000)
  //   // Play
  //   // browser.click(classPage.playPauseButton)
  //   // Pause so scroll can take place
  //   browser.pause(5000)
  //   // // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-scrolling.png')
  // })

  // it('Creates Message', () => {

  //   // Pause
  //   browser.scroll(classPage.sectionLiveclass).pause(1000)

  //   let ts = $$(classPage.timeSegment)[0]
  //   ts.click()

  //   browser.pause(500)

  //   let txt = 'This is a #test message from Selenium at ' + Moment()

  //   browser.setValue(classPage.activeComposer, txt)

  //   $(classPage.activeComposerButton).click().pause(3000)

  //   assert($(classPage.peekSegmentMessageText).getText() === `${txt} ${testEnv.HASHTAG}`)

  //   // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-testmessage.png')
  // })

  // it('Creates Message', () => {

  //   // Pause
  //   browser.scroll(classPage.sectionLiveclass).pause(1000)

  //   let ts = $$(classPage.timeSegment)[0]
  //   ts.click()

  //   browser.pause(500)

  //   let txt = 'This is a #test message from Selenium at ' + Moment()

  //   browser.setValue(classPage.activeComposer, txt)

  //   $(classPage.activeComposerButton).click().pause(3000)

  //   assert($(classPage.peekSegmentMessageText).getText() === `${txt} ${testEnv.HASHTAG}`)
  
  //   // Save screenshot
  //   browser.saveScreenshot('./test/screenshots/liveclass/liveclass-testmessage.png')
  // })

//   it('Scrolls up and down a lot then makes another message', () => {
    
//     $(classPage.continueListeningButton).waitForExist(5000)

//     $(classPage.continueListeningButton).scroll(0, 300)
//     $(classPage.continueListeningButton).click()

//     browser.pause(2000)

//     for (let i = 0; i < CREATE_MESSAGE_COUNT; i++) {

//       // Pick random block
//       let sblock = _sample($$(classPage.timeSegment))

//       browser.scroll(0, browser.elementIdLocation(sblock.ELEMENT).value.y - 50).pause(1000)
//       browser.pause(500)
//       browser.scroll(0, browser.elementIdLocation(sblock.ELEMENT).value.y - 30).pause(1000)

//       browser.pause(3000) // Let it play

//       let block = pickMessageVisibleBlock(sblock)

//       block.click()
//       browser.pause(500)

//       let txt = 'This is a #test message from Selenium at ' + Moment()
//       browser.setValue(classPage.activeComposer, txt)
      
//       browser.pause(2000)
//       $(classPage.activeComposerButton).click()
//       browser.pause(2000)
      
//       console.log($(classPage.peekSegmentMessageText).getText())
//       console.log(`${txt} ${testEnv.HASHTAG}`)

//       chai.expect(classPage.peekSegmentMessageText).to.have.text(`${txt} ${testEnv.HASHTAG}`)

//       // Save screenshot
//       browser.saveScreenshot(`./test/screenshots/liveclass/liveclass-testmessage-${i}.png`)

//       browser.click('#content-overlay', 50, 50).pause(200)
//     }
//   })

// })

// function pickMessageVisibleBlock(sblock) {

//   let time = parseInt(browser.elementIdAttribute(sblock.ELEMENT, 'data-top').value)

//   let inviewport = []

//   for (let i = 1; i < 2; i++)
//   {
//     const expectedTop = (time + (i * 158))
//     let isview = browser.isVisibleWithinViewport(`[data-top='${expectedTop}']`)
//     if (isview) {
//       inviewport.push(`[data-top='${expectedTop}']`)
//     }
//   }

//   return $(`${_sample(inviewport)}`)
// }
