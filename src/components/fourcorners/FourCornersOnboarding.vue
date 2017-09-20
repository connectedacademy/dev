<template lang="pug">

  .fourcorners-page
    
    .col#col-main

      previous-button

      .main-container.main-container-padded.background-white


        a(href="https://fourcorners.io" target="_blank")
          img(src="../../assets/logos/fourcorners/black.svg" height="40")

        hr

        p FourCorners is simple way of representing context information about photographs. It enables the reader to see what is happening in the photograph, why the photographer made it and under what conditions.

        p Ex-New York Times Photo Editor [Fred Ritchin], proposed the idea in his book `After Photography`. He envisaged each corner of an image providing access to extra information; top left would be the frames before and after, top right would be links to further, related information. Bottom left would be the background-story of the image and bottom right would be the photographer’s name, copyright terms and, their code of ethics.

        p We’re using 4C because it shifts the role of the photographer from being suppliers of content to becoming publishers, and allows the reader to interregate the photograph in a richer way.**

      .main-container.main-container-padded.background-white
      
        four-corners-interaction

      .main-container.main-container-padded.background-white#get-started
      
        h1.content-title Get Started

        p We have worked to make the experience of adding FourCorners images to your website as easy as possible. To get started select your platform from the list below.

        .platform-tiles-wrapper
          ul.platform-tiles
            li.platform-tile(v-for="(provider, index) in providers" @click="currentProvider = index" v-bind:class="{ active: (currentProvider === index) }")
              .platform-tile--title {{ provider.name }}
            .clearfix

        .platform-details(v-for="(provider, index) in providers" v-if="index === currentProvider")
          
          markdown-renderer(v-if="provider.link !== undefined" v-bind:markdown-url="provider.link")
          
          br

          .video-walkthrough(v-if="provider.video !== undefined")
            video-embed(v-bind:video-src="provider.video")
            
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import * as types from '@/store/mutation-types';

import PreviousButton from '@/components/PreviousButton';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import VideoEmbed from '@/components/VideoEmbed';

import FourCornersInteraction from '@/components/fourcorners/FourCornersInteraction';

export default {
  name: 'four-corners-onboarding',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(types.SET_NAV_STATE, { minimized: false });
      vm.$store.commit(types.SET_PAGE_STYLE, 'fourcorners');
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit(types.SET_NAV_STATE, { minimized: true });
    this.$store.commit(types.SET_PAGE_STYLE, undefined);
    next();
  },
  components: {
    PreviousButton,
    FourCornersInteraction,
    MarkdownRenderer,
    VideoEmbed,
  },
  data() {
    return {
      navTitle: 'Connected Academy - FourCorners',
      currentProvider: undefined,
      providers: [
        {
          name: 'Wordpress',
          link: 'https://digitalinteraction.github.io/fourcorners/howto/wordpress.md',          
          video: 'VqmSFDc_ZlY',
        },
        {
          name: 'Squarespace',
          link: 'https://digitalinteraction.github.io/fourcorners/howto/squarespace.md',
          video: 'xSIU4yPzZ8E',
        },
        {
          name: 'Blogger',
          link: 'https://digitalinteraction.github.io/fourcorners/howto/blogger.md',
          video: 'B5aAWHoYXGY',
        },
        {
          name: 'Other',
          link: 'https://digitalinteraction.github.io/fourcorners/howto/generic.md',
          video: undefined,
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      'isAuthenticated', 'isRegistered',
    ]),
  },
  methods: {
    previous() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.fourcorners-page
  .col#col-main
    .main-container.main-container-padded.background-white
      margin-bottom 30px
      h1.content-title
        reset()
        color $color-text-dark-grey
        font-size 1.3em
        font-weight bold
  
  hr
    border none
    border-bottom $color-border 1px solid
  
  img 
    width 100%

  .platform-details
    margin-top 20px
    .video-container
      margin 0 !important

  .platform-tiles-wrapper
    ul.platform-tiles
      cleanlist()
      margin -10px -10px -10px -10px
      li.platform-tile
        animate()
        cleanlist()
        box-sizing()
        background-color lighten($color-lighter-grey, 50%)
        float left
        line-height 50px
        margin 10px
        padding 0 20px
        text-align center
        width calc(calc(100% / 4) - 20px)
        @media(max-width: 680px)
          width calc(calc(100% / 3) - 20px)
        @media(max-width: 560px)
          width calc(calc(100% / 2) - 20px)
        .platform-tile--title
          animate()
          color $color-darkest-grey
          font-weight bold
        &:hover
          background-color $color-lighter-grey
          cursor pointer
        &.active
          background-color $color-darkest-grey
          cursor pointer
          .platform-tile--title
            color white

</style>
