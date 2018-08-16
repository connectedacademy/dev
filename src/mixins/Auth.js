import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user']),
    isAdmin() {
      return this.user && this.user.roles.admin
    }
  },
  methods: {
    showAuth() {
      this.$store.commit('SHOW_AUTH')
    }
  }
}
