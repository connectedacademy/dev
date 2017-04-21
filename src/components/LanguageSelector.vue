<template lang="pug">

  .language-selector
    form.pure-form.pure-form-stacked
      fieldset
        label {{ $t('course.current_course_language') }}
        select(v-model="selectedCourse")
          option(v-for="lang in availableCourseLangs") {{ lang }}

</template>

<script>
import * as types from '../store/mutation-types';

export default {
  name: 'language-selector',
  methods: {
    setCourseLang() {
    },
  },
  data() {
    return {
      selectedCourse: '',
    };
  },
  computed: {
    availableCourseLangs() {
      return this.$store.getters.course.langs;
    },
  },
};
</script>

<style lang="stylus">

@import '../assets/stylus/shared/*'

.language-selector
  form
    padding 20px
    fieldset
      label
        color white
        margin-bottom 5px
      select
        min-width 80px

</style>
