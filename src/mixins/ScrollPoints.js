import { clearInterval } from "timers";

export default {
  data() {
    return {
      documentHeight: 0,
      updateDocumentHeightInterval: undefined
    }
  },
  mounted() {
    // Periodically update document height variable
    this.updateDocumentHeightInterval = setInterval(() => { this.updateDocumentHeight() }, 5000);
  },
  beforeDestroy() {
    if (this.autoUpdateInterval) {
      clearInterval(this.updateDocumentHeightInterval)
    }
  },
  methods: {
    updateDocumentHeight() {
      // Check if document height has changed
      if (this.documentHeight !== document.documentElement.scrollHeight) {
        this.documentHeight = document.documentElement.scrollHeight
        this.setScrollPoints();
      }
    },
    setScrollPoints() {
      const currentClass = this.$store.getters.currentClass;

      if ((currentClass === undefined) || (currentClass.content === undefined)) {
        return;
      }

      for (var content of currentClass.content) {
        if (content.slug) {

          const element = document.getElementById('course-content-' + content.slug);

          if ((!element) || (typeof element === 'null') || (typeof element === 'undefined')) continue

          let additionalOffset = 380;

          this.$store.commit('SET_SCROLL_POINT', {
            title: content.title,
            slug: content.slug,
            content_type: content.content_type,
            sectionTop: element.offsetTop,
            top: (additionalOffset + element.offsetTop),
            bottom: element.offsetTop + element.offsetHeight,
            duration: content.duration,
            transcript: content.transcript,
            prompts: content.prompts,
            images: content.images,
            videoId: content.video,
            soundcloudId: content.soundcloudId,
          })
        }
      }
    }
  }
}
