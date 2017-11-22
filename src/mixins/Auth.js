import API from '@/api'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      checkingAuthentication: true
    }
  },
  computed: {
    ...mapGetters(['user', 'isAuthenticated']),
    isAdmin() {
      return this.user && this.user.admin
    }
  },
  methods: {
    ensureAuthenticated() {
      API.auth.checkAuth(
        (response) => {
          if (!response.user.registration) {
            this.$router.replace({ name: 'home' })
          }
          else {
            this.checkingAuthentication = false
          }
        },
        (response) => {
          // TODO: Better handle failed request
          this.checkingAuthentication = false
          this.$router.replace({ name: 'home' })
        }
      )
    },
    ensureNotRegistered() {
      API.auth.checkAuth(
        (response) => {
          if (response.user.registration) {
            this.$router.replace({ name: 'home' })
          }
          else {
            this.checkingAuthentication = false
          }
        },
        (response) => {
          // TODO: Better handle failed request
          this.checkingAuthentication = false
        }
      )
    },
    showAuth() {
      this.$store.commit('SET_ACTIVE_SEGMENT', undefined)
      this.$store.commit('SET_PEEK_SEGMENT', undefined)
      this.$store.commit('SHOW_AUTH')
    }
  }
}
