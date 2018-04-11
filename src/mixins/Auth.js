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
      this.$store.commit('SHOW_AUTH')
    }
  }
}
