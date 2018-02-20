import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user']),
    isAdmin() {
      return this.user && this.user.admin
    }
  },
  methods: {
    showAuth() {
      this.$store.commit('SET_ACTIVE_SEGMENT', undefined)
      this.$store.commit('SET_PEEK_SEGMENT', undefined)
      this.$store.commit('SHOW_AUTH')
    }
  }
}
