<template lang="pug">
.loading
  .loading-wrapper(v-for="n in 3")
      .padded-container.mock-container(v-bind:style="{ height: `${(6 - n) * 50}px`, opacity: `${(1.2 - (n / 5))}` }")
</template>

<script>
export default {
  name: 'loading'
}
</script>


<style lang="stylus" scoped>

@import '~stylus/shared'

.padded-container.mock-container
  background-color white
  margin-top 20px
  @media(min-width: 800px)
    box-shadow()
    radius($corner-radius)

</style>