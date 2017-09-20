<template lang="pug">
.loading
  .loading-wrapper(v-for="n in 5")
      .padded-container.mock-container(v-bind:style="{ height: `${(5 - n) * 100}px` }")
</template>

<script>
export default {
  name: 'loading'
}
</script>


<style lang="stylus" scoped>

@import '~stylus/shared'

.padded-container.mock-container
  background-color alpha(white, 0.8)
  margin-bottom 10px


</style>