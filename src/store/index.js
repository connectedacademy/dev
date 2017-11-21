import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import conversation from './modules/conversation'
import course from './modules/course'
import lightbox from './modules/lightbox'
import media from './modules/media'
import navigation from './modules/navigation'
import profile from './modules/profile'
import scroll from './modules/scroll'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    conversation,
    course,
    lightbox,
    media,
    navigation,
    profile,
    scroll
  }
})
