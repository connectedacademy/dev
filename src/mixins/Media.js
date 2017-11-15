import Vue from 'vue';

export default {
  methods: {
    loadMedia(content) {
      if (typeof content.images === 'undefined') return
      Vue.$log.info('Getting media...');
      this.$store.dispatch('getMedia', { slug: `${content.slug}`, path: `${this.course.baseUri}${this.currentClass.dir}/${this.content.images}` });
    }
  },
}
