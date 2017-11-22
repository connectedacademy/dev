export default {
  computed: {
    overlayVisible() {
      return this.modalVisible ||
        this.$store.state.navigation.overlayVisible ||
        this.$store.state.auth.visible ||
        (typeof this.$store.getters.profileAction !== 'undefined') ||
        (typeof this.$store.state.conversation.activeSegment !== 'undefined') ||
        (typeof this.$store.state.conversation.peekSegment !== 'undefined')
    }
  },
  methods: {
    dismissOverlay() {
      this.$store.dispatch('dismissOverlay')

      if (typeof this.$store.getters.activeSegment !== 'undefined') {
        this.$store.commit('SET_ACTIVE_SEGMENT', undefined)
      } else {
        this.$store.commit('SET_PEEK_SEGMENT', undefined)
      }
      this.$store.commit('SET_REPLYING_TO', undefined)
    }
  }
}
