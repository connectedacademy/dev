import Vue from 'vue';

export default {
  methods: {
    loadSubtitles() {
      Vue.log.log('Getting subtitles...');
      this.subtitles = this.$store.getters.subtitles;
    }
  },
}
