/* eslint-disable */
export default {
  methods: {
    setScrollPoints() {
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

            this.$store.commit('setScrollPoint', {
              slug: content.slug,
              top: (additionalOffset + element.offsetTop),
              bottom: (additionalOffset + element.offsetTop) + element.offsetHeight,
              duration: content.duration,
              videoId: content.video,
              transcript: content.transcript,
            });
          }
        }
      }
    },
  },
}
