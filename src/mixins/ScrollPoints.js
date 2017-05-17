/* eslint-disable */
export default {
  methods: {
    setScrollPoints() {
      console.log('Setting scroll points');
      if (this.$store.getters.currentClass === undefined) {
        return;
      }
      for (var content of this.$store.getters.currentClass.content) {
        if (content.slug) {

          const element = document.getElementById('course-content-' + content.slug);

          if (element) {

            // Search for conversation container and add as offset
            const conversationContainer = element.querySelector('.conversation-container');

            let additionalOffset = (conversationContainer) ? conversationContainer.offsetTop : 0;

            if (conversationContainer) {
              additionalOffset += conversationContainer.querySelector('.spacer').offsetHeight;
            }

            // if (element.offsetTop !== this.$store.getters.scrollPoints[content.slug].sectionTop) {

              this.$store.commit('setScrollPoint', {
                slug: content.slug,
                content_type: content.content_type,
                sectionTop: element.offsetTop,
                top: (additionalOffset + element.offsetTop),
                bottom: element.offsetTop + element.offsetHeight,
                duration: content.duration,
                videoId: content.video,
                transcript: content.transcript,
              });
            // }
          }
        }
      }
    },
  },
}
