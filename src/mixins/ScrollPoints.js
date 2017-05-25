/* eslint-disable */
import Vue from 'vue';

export default {
  methods: {
    setScrollPoints() {
      Vue.log.log('Updating scroll points');

      const currentClass = this.$store.getters.currentClass;

      if (currentClass === undefined) { return; }
      if (currentClass.content === undefined) { return; }

      for (var content of currentClass.content) {
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
              content_type: content.content_type,
              sectionTop: element.offsetTop - 60.0, // Navbar height
              top: (additionalOffset + element.offsetTop),
              bottom: element.offsetTop + element.offsetHeight,
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
