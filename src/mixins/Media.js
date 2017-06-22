import Vue from 'vue';

export default {
  methods: {
    loadMedia() {
      Vue.log.log('Getting media...');
      this.media = this.$store.getters.media;
    }
  },
}
