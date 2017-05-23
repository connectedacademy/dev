export default {
  methods: {
    loadSubtitles() {
      console.log('Getting subtitles...');
      this.subtitles = this.$store.getters.subtitles;
    }
  },
}
