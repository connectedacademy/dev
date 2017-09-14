import Vue from 'vue';

export default {
  methods: {
    loadMedia() {
      Vue.$log.info('Getting media...');
      this.$store.dispatch('getMedia', { slug: `${this.content.slug}`, path: `${this.course.baseUri}${this.currentClass.dir}/${this.content.images}` });
    }
  },
}
