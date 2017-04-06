<template lang="pug">

.col#col-main(v-bind:class="this.$store.state.layout.columns.main.state")
  .container
    h1.text-white {{ course.name || 'Course' }}
    h2.text-white {{ course.hashtag }}

    .debug-wrapper(v-if="this.$store.state.navigation.debug")
      .content-block.white-block
        .pure-button.pure-button-primary(@click="loadCourse") {{ $t('course.load_course') }}
        pre(v-if="course") {{ course }}

      .content-block.white-block
        .pure-button.pure-button-primary(@click="loadHubs") {{ $t('course.load_hubs') }}
        pre(v-if="hubs") {{ hubs }}

  .container
    .pure-button.pure-button-primary(@click="toggleColumnState") {{ $t('common.toggle_column') }}

</template>

<script>
export default {
  name: 'course',
  created() {
    this.$store.dispatch('setColumnState', 'wide');
  },
  data() {
    return {
      navTitle: 'Course - Connected Academy',
      courseVisible: false,
    };
  },
  computed: {
    course() {
      return this.$store.getters.course;
    },
    hubs() {
      return this.$store.getters.hubs;
    },
  },
  components: {},
  methods: {
    toggleColumnState() {
      this.$store.dispatch('toggleColumnState');
    },
    loadCourse() {
      this.$store.dispatch('getCourse');
    },
    loadHubs() {
      this.$store.dispatch('getHubs');
    },
  },
};
</script>

<style lang="stylus" scoped>

  @import "../../assets/stylus/shared/*"
  @import "../../assets/stylus/layout/page"

  h1, h2
    nomargin()
    nopadding()
    color white
    margin-bottom 5px
  h2
    color white

</style>
