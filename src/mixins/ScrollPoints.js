/* eslint-disable */
import Vue from 'vue';

export default {
  methods: {
    setScrollPoints() {
      Vue.log.log('Updating scroll points');

      const currentClass = this.$store.getters.currentClass;

      if ((currentClass === undefined) || (currentClass.content === undefined)) {
        return;
      }

      for (var content of currentClass.content) {
        if (content.slug) {

          const element = document.getElementById('course-content-' + content.slug);

          if (element) {

            let additionalOffset = 180;

            this.$store.commit('setScrollPoint', {
              title: content.title,
              slug: content.slug,
              content_type: content.content_type,
              sectionTop: element.offsetTop,
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
