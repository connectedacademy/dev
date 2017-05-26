<template lang="pug">

.rendered-markdown(v-html="renderedMarkdown")

</template>

<script>
import _ from 'lodash';
import Vue from 'vue';
import { mapGetters } from 'vuex';

import MarkdownIt from 'markdown-it';
import MarkdownItReplaceLink from 'markdown-it-replace-link';
import MarkdownItVideo from 'markdown-it-video';
import MarkdownItFrontMatter from 'markdown-it-front-matter';
import MarkdownItCustomBlock from 'markdown-it-custom-block';

import API from '@/api';
import * as types from '@/store/mutation-types';

export default {
  name: 'markdown-content',
  props: ['markdown'],
  computed: {
    ...mapGetters([
      'course'
    ]),
    renderedMarkdown() {

      const md = new MarkdownIt({
        html: true,
        linkify: true,
        replaceLink: (link, env) => {

          if (_.startsWith(link, 'http')) { return link; }
          if (_.endsWith(link, '.md')) {
            const url = this.getUrl();
            const currentUrl = url.substring(0, url.lastIndexOf('/') + 1);
            return `/#/markdown/${encodeURIComponent(link)}`;
          }
          return `${this.$store.getters.course.baseUri}${link}`;
        },
      })
      .use(MarkdownItReplaceLink)
      .use(MarkdownItVideo, {
        youtube: { width: 640, height: 390 },
        vimeo: { width: 500, height: 281 },
      })
      .use(MarkdownItFrontMatter, (fm) => {
        this.frontMatter = fm;
      });

      return `<div>${md.render(this.markdown)}</div>`;
    },
  },
};
</script>

<style lang="stylus">

@import '../assets/stylus/shared/*'
@import '../assets/stylus/layout/page'

.rendered-markdown
  h1
    nomargin()
    nopadding()
    color $color-text-dark-grey
    margin-bottom 5px
  h1, h2, h3, h4, h5, p, a, li
    color $color-text-dark-grey
  img
    max-width 100%
.fourcorners-submission
  radius(6px)
  background-color $color-primary
  box-sizing border-box
  padding 15px
  width 100%
  label
    color white
  p
    nomargin()
    nopadding()
    color white
  textarea
    radius(6px)
    border none
    box-shadow none
    box-sizing border-box
    line-height 40px
    margin 10px 0
    padding 0 10px
    outline 0
    resize none
    width 100%
  button
    margin-top 10px


</style>
