import Vue from 'vue';

export default {
  methods: {
    loadMedia() {
      Vue.$log.info('Getting media...');
      this.media = this.$store.getters.media;
    }
  },
}
