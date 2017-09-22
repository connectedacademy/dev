export default {
  data() {
    return {
      documentHeight: 0
    }
  },
  mounted() {
    // Periodically update document height variable
    window.setInterval(this.updateDocumentHeight, 3000);
  },
  methods: {
    updateDocumentHeight() {
      // Check if document height has changed
      if (this.documentHeight !== document.documentElement.scrollHeight) {
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

          if (element) {

            let additionalOffset = 380;

            this.$store.commit('setScrollPoint', {
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
            });
          }
        }
      }
    },
  },
}
