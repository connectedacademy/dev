<template lang="pug">

.admin-panel

  .admin-panel--header
    h1 Storify

  .admin-panel--content

    h5 Please copy and paste the following link into the Storify editor.
    input(v-model="rssLink" placeholder="RSS Link")
    
    img.storify-gif(src="../../../assets/gifs/storify.gif" width="100%")

</template>

<script>
export default {
  name: 'storify',
  computed: {
    rssLink() {
      return `https://api.connectedacademy.io/v1/classroom/rss/${this.classroomCode}`;
    }
  },
};

</script>

<style lang="stylus" scoped>

@import '~stylus/shared'
@import '~stylus/admin'

.admin-panel
  background-image()
  background-image url('https://storify.com/public/img/homepage/background.png') !important
  .admin-panel--content
    h5
      reset()
      margin-bottom 15px
    input
      radius(4px)
      border $color-border 1px solid
      box-sizing()
      padding 10px
      width 100%
    img.storify-gif
      border $color-border 1px solid
      margin 30px auto
</style>
