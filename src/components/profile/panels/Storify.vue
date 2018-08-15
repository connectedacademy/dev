<template lang="pug">

.profile-panel(v-if="classroom" v-bind:class="{ collapsed: false, expanded: expandedView }")

  profile-panel-header(label="Storify")

  .profile-panel--content

    h5 Storify allows you to create a narrative around the conversations and content of your live class.

    img.storify-gif(src="../../../assets/gifs/storify.gif" width="100%")

    h5 The following link will make your class content accessible from the Storify editor.
    input(ref="inputfield" v-model="storifyLink" placeholder="RSS Link")

    #copy-button(@click="copyLink") {{ copyText }}

    a#storify-button(v-if="openVisible" href="https://storify.com/" target="_blank") Open Storify
    
</template>

<script>
import API from '@/api'
import * as config from '@/api/config'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

import ProfilePanelHeader from '@/components/profile/ProfilePanelHeader'

import _filter from 'lodash/filter'
import _find from 'lodash/find'

export default {
  name: 'storify',
  props: ['classSlug', 'expandedView'],
  components: {
    ProfilePanelHeader,
  },
  mounted() {
    this.getClassrooms()
    Events.$on('profileClassUpdated', () => {
      this.getClassrooms()
    })
  },
  data() {
    return {
      classroom: undefined,
      rssLink: undefined,
      openVisible: false,
      copyText: 'Copy Link',
    }
  },
  computed: {
    ...mapGetters(['user', 'profileClass', 'profileClassSlug']),
    storifyLink() {
      return this.classroom ? `${config.API}/classroom/rss/${this.classroom.code}` : 'Not available'
    }
  },
  methods: {
    getClassrooms() {
      API.teacher.getClassrooms(
        this.profileClassSlug,
        (response) => {
          this.$log.info(response)
          this.classroom = response[0]
        },
        (response) => {
          // TODO: Handle failed request
          this.$log.error(response)
          this.$log.info('Failed to retrieve classrooms')
          this.classroom = undefined
        }
      )
    },
    copyLink() {
      this.$refs.inputfield.focus()
      this.$refs.inputfield.select()
      this.$refs.inputfield.setSelectionRange(0, this.$refs.inputfield.value.length)
      document.execCommand('copy')
      this.copyText = 'Link Copied!'
      this.openVisible = true
      setTimeout(() => {
        this.copyText = 'Copy Link'
        this.openVisible = false
      }, 20000)
    }
  }
}

</script>

<style lang="stylus" scoped>

@import '~stylus/profile'
@import '~stylus/buttons'

.profile-panel
  .profile-panel--content
    padding 15px
    h5
      reset()
    input
      radius(4px)
      box-sizing()
      background-color $color-lightest-grey
      border none
      padding 20px
      margin 10px auto 30px auto
      outline 0
      width 100%
    img.storify-gif
      border $color-border 1px solid
      margin 10px auto 30px auto

    #copy-button, a#storify-button
      color white
      cursor pointer
      display block
      line-height 50px
      text-align center
      text-decoration none
      &#copy-button
        background-color $color-success
        margin-bottom 10px
      &#storify-button
        background-color $color-storify
</style>
