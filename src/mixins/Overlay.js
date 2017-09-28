export default {
  methods: {
    dismissOverlay() {
      this.$store.commit('DISMISS_AUTH');
      this.$store.commit('DISMISS_INFO_MODAL');
      this.$store.commit('DISMISS_LEFT_DRAWER');
      this.$store.commit('DISMISS_RIGHT_DRAWER');

      if (this.$store.getters.activeSegment) {
        this.$store.commit('SET_ACTIVE_SEGMENT', undefined);
      } else {
        this.$store.commit('SET_PEEK_SEGMENT', undefined);
      }
      this.$store.commit('SET_REPLYING_TO', undefined);
    },
  },
}
