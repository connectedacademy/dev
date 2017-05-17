<template lang="pug">

.markdown-wrapper

  .content-block.white-block(v-if="frontMatterVisible")
    pre {{ frontMatter }}

  .rendered-markdown(ref="renderedmarkdown")
    p {{ $t('common.loading') }}

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
  name: 'markdown-renderer',
  watch: {
    '$route': {
      handler: function(nV, oV) {
        this.loadMarkdown();
      },
      deep: true,
    },
  },
  mounted() {
    this.loadMarkdown();
  },
  props: ['markdownUrl', 'frontMatterVisible'],
  methods: {
    getUrl() {
      if (this.markdownUrl) {
        return this.markdownUrl;
      }
      let url = this.$route.params.url;
      url = _.startsWith(url, 'http') ? url : `${this.$store.getters.course.baseUri}${url}`;
      return url;
    },
    loadMarkdown() {
      this.loading = true;
      API.markdown.fetchMarkdown(
        this.getUrl(),
        (response) => {
          this.renderedMarkdown = response;
          this.loading = false;
          this.renderMarkdown();
        },
        (response) => {
          this.renderedMarkdown = '';
        },
      );
    },
    renderMarkdown() {
      // Render markdown
      var res = Vue.compile(this.rawMarkdown);

      var RenderedMarkdown = new Vue({
        name: 'rendered-markdown',
        parent: this,
        data() {
          return {
            fourcornersLink: '',
          };
        },
        computed: {
          ...mapGetters([
            'isRegistered',
          ]),
          contentUrl() {
            const url = 'test';
            const course = this.$store.getters.course;

            const currentClass = _.find(course.classes, function(o) {
              return o.dir === 'class1';
            });

            const currentContent = _.find(currentClass.content, function(o) {
              return o.url === 'intro.md';
            });

            const full = window.location.host;
            const parts = full.split('.');
            let sub = parts[0];

            sub = (_.startsWith(sub, 'localhost')) ? 'testclass' : sub;

            const newUrl = 'https://' + sub + '.connectedacademy.io/#/submission';

            return `${newUrl}/${currentClass.slug}/${currentContent.slug}`;
          },
          tweet() { return `${this.fourcornersLink} ${this.contentUrl} ${this.$parent.$store.getters.course.hashtag}`; },
        },
        methods: {
          showAuth() {
            this.$store.commit(types.SHOW_AUTH);
          },
          goToLink(href) {
            this.$router.push(href.replace('/#/markdown','/markdown'));
          },
          postTweet() {
            // Post tweet
            alert('Posting tweet');

            const postData = {
              text: this.tweet,
            };

            API.message.sendMessage(
              postData,
              (response) => {
                this.$store.commit(types.SEND_MESSAGE_SUCCESS, { response })
              },
              (response) => {
                this.$store.commit(types.SEND_MESSAGE_FAILURE, { response })
              },
            );
          },
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns,
      }).$mount();

      this.$refs.renderedmarkdown.replaceChild(RenderedMarkdown.$el, this.$refs.renderedmarkdown.childNodes[0]);
    },
  },
  computed: {
    ...mapGetters([
      'course'
    ]),
    rawMarkdown() {
      var iterator = require('markdown-it-for-inline');

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
      })
      .use(MarkdownItCustomBlock, {
        submission(arg) {
          if (arg === 'fourcorners') {
            return `
            <div class="fourcorners-submission" v-if="isRegistered">
              <label>Submit URL</label>
              <textarea name="text" placeholder="Paste a link to your FourCorners image here*" v-model="fourcornersLink"></textarea>
              <p>*this will send a tweet on your behalf!</p>
              <p>{{ this.tweet }}</p>
              <button class="pure-button" v-on:click="postTweet">Submit</button>
            </div>
            <button v-if="!isRegistered" class="pure-button pure-button-primary" v-on:click="showAuth">Please authenticate</button>`;
          }
        }
      });

      md.renderer.rules.link_open = (tokens, idx) => {
        return `<a v-on:click="goToLink('${md.utils.escapeHtml(tokens[idx].attrs[0][1])}')">`;
      };

      return `<div>${md.render(this.renderedMarkdown)}</div>`;
    },
  },
  data() {
    return {
      loading: true,
      renderedMarkdown: 'Loading...',
      frontMatter: {},
    };
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
