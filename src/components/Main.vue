<template lang="pug">

  .col#col-main(ref="main" v-bind:class="this.$store.state.layout.columns.main.state" @scroll="onScroll")

    .stream

      pre-content

      class-content

      post-class-content

      webinar-content

      post-webinar-content

    message-composer(v-bind:scroll-position="scrollPosition")

</template>

<script>
import MessageComposer from './MessageComposer';

import PreContent from './content/PreContent';
import ClassContent from './content/ClassContent';
import PostClassContent from './content/PostClassContent';
import WebinarContent from './content/WebinarContent';
import PostWebinarContent from './content/PostWebinarContent';

export default {
  name: 'main',
  created() {
    this.$store.dispatch('setColumnState', 'narrow');
  },
  data() {
    return {
      navTitle: 'Connected Academy - Main',
      scrollPosition: 0,
    };
  },
  components: {
    MessageComposer,
    PreContent,
    ClassContent,
    PostClassContent,
    WebinarContent,
    PostWebinarContent,
  },
  methods: {
    onScroll() {
      this.scrollPosition = this.$refs.main.scrollTop / 100;
      this.scrollPosition = (this.scrollPosition < 0) ? 0 : this.scrollPosition;
    },
  },
};
</script>

<style lang="stylus">

@import "../assets/stylus/layout/page"

  .stream
    padding-bottom 80px
  	.msg-container
  		padding 20px
      width 50%
  		.msg
  			border-radius 6px
  			margin 10px 0
  			padding 10px 15px

  			position relative

  			opacity 0

  			transition opacity 1s
  			p
  				nomargin()
  				nopadding()
  				color white
  			&.visible
  				opacity 1

</style>
