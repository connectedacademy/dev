var ClassPage = (function () {

  function ClassPage() {
    this.continueListeningButton = "[name='continue-listening']"
    this.playPauseButton = "[name='play-pause-button']"
    this.sectionLiveclass = "[name='section-liveclass']"
    this.timeSegment = ".time-segment"
    this.actionPanel = "[name='action-panel']"
    this.activeComposer = ".time-segment.peek [name='composer-textarea']"
    this.activeComposerButton = ".message-composer--footer > .composer-actions > button"
    this.peekSegmentMessageText = ".time-segment.peek .single-message-wrapper .message .message-content"
  }

  return ClassPage

})()

module.exports = ClassPage
