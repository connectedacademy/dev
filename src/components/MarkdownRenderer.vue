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

import FourCornersMixin from '@/mixins/FourCorners';
import FourCorners from './fourcorners/FourCorners';

import MarkdownIt from 'markdown-it';
import MarkdownItReplaceLink from 'markdown-it-replace-link';
import MarkdownItVideo from 'markdown-it-video';
import MarkdownItFrontMatter from 'markdown-it-front-matter';
import MarkdownItCustomBlock from 'markdown-it-custom-block';

import API from '@/api';
import * as types from '@/store/mutation-types';

export default {
  name: 'markdown-renderer',
  mixins: [
    FourCornersMixin,
  ],
  components: {
    FourCorners,
  },
  watch: {
    '$route': {
      handler: function(nV, oV) {
        this.loadMarkdown();
      },
      deep: true,
    },
    course() {
      this.loadMarkdown();
    },
  },
  mounted() {
    this.loadMarkdown();
  },
  props: ['markdownUrl', 'frontMatterVisible'],
  data() {
    return {
      loading: true,
      renderedMarkdown: 'Loading...',
      frontMatter: {},
    };
  },
  methods: {
    getUrl() {
      if (this.markdownUrl) {
        return this.markdownUrl;
      }
      let url = this.$route.params.url;
      if (_.startsWith(url, 'http')) {
        return url;
      } else {
        if (!(this.$store.getters.course && this.$store.getters.course.baseUri)) {
          return '';
        } else {
          return `${this.$store.getters.course.baseUri}${url}`
        }
      }
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

      this.$log.info('Rendering markdown');

      // Render markdown
      var res = Vue.compile(this.rawMarkdown);

      var parent = this;
      var RenderedMarkdown = new Vue({
        name: 'rendered-markdown',
        parent: this,
        mounted() {

          this.checkingSubmissions = true;

          const request = { class: parent.theClass, content: parent.theContent };

          API.feedback.getFeedbackItems(request,
            (response) =>{
              this.$log.info('Submission check response');
              this.$log.info(response);
              this.checkingSubmissions = false;
              this.submitted = false;// (response.data.length === 0) ? false : true;
            },
            (response) =>{
              this.checkingSubmissions = false;
            });
        },
        data() {
          return {
            fourcornersLink: '',
            checkingSubmissions: true,
            submitting: false,
            submitted: false,
          };
        },
        computed: {
          ...mapGetters([
            'isRegistered',
          ]),
          contentUrl() {
            return `${window.location.protocol}//${window.location.host}/#/submission/${parent.theClass}/${parent.theContent}`;
          },
          tweet() {
            return `${this.fourcornersLink} ${this.contentUrl} ${this.$parent.$store.getters.course.hashtag}`;
          },
        },
        methods: {
          showAuth() {
            this.$store.commit(types.SHOW_AUTH);
          },
          goToLink(href) {
            this.$router.push(href.replace('/#/markdown', '/markdown'));
          },
          postTweet() {

            // Submit
            this.submitting = true;
            this.submitted = false;

            const postData = {
              text: this.tweet,
            };

            API.message.sendMessage(
              postData,
              (response) => {
                this.submitting = false;
                this.submitted = true;
                this.$store.commit(types.SEND_MESSAGE_SUCCESS, { response })
              },
              (response) => {
                alert('Submission failed, please try again.');
                this.submitting = false;
                this.submitted = false;
                this.$store.commit(types.SEND_MESSAGE_FAILURE, { response })
              },
            );
          },
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns,
      }).$mount();

      this.$refs.renderedmarkdown.replaceChild(RenderedMarkdown.$el, this.$refs.renderedmarkdown.childNodes[0]);

      // Load four corners
      var self = this;
      setTimeout(function() {
        self.loadFourCornersScript();
      }, 500);
    },
  },
  computed: {
    ...mapGetters([
      'course'
    ]),
    rawMarkdown() {

      var parent = this;

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

          if (!this.$store.getters.course) {
            return '';
          } else {
            return `${this.$store.getters.course.baseUri}${link}`
          }
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

        bio(arg) {
          if (!arg) { return 'loading...'; }

          const parts = arg.split('|');

          const caption = parts[0].trim();
          const image = parts[1].trim();

          if (parts.length > 2) { // if (bio !=== '') {
            const bio = parts[2].trim();
            const link = parts[3].trim();

            return `
            <div class="md-bio md-bio--with-bio">
              <img class="md-bio--image" src="${image}" />
              <div class="md-bio--content">
                <h5 class="md-bio--caption">${caption}</h5>
                <p class="md-bio--bio">${bio}</p>
                <a href="${link}" target="_blank" class="md-bio--link">${link}</a>
              </div>
            </div>
            `;
          } else {
            return `
            <div class="md-bio">
              <img class="md-bio--image" src="${image}" />
              <h5 class="md-bio--caption">${caption}</h5>
            </div>
            `;
          }
        },
      });

      md.renderer.rules.link_open = (tokens, idx) => {
        const href = md.utils.escapeHtml(tokens[idx].attrs[0][1]);
        if (href.startsWith('http')) {
          // Absolute link so do nothing
          return `<a href="${href}" target="_blank">`
        } else {
          // Relative link so replace with Vue navigation
          return `<a v-on:click="goToLink('${href}')">`;
        }
      };

      return `<div>${md.render(this.renderedMarkdown)}</div>`;
    },
  },
};
</script>

<style lang="stylus">

@import '~stylus/shared'

.rendered-markdown
  h1
    reset()
    color $color-text-dark-grey
    margin-bottom 5px
  h1, h2, h3, h4, h5, p, a, li
    color $color-text-dark-grey
    &:first-child
      margin-top 0
  h1, h2, h3, h4, h5
    font-weight 300
  h2
    color $color-text-dark-grey
    font-size 1.3em
    font-weight bold
  p
    margin 10px 0
  a
    color $color-primary !important
    text-decoration underline
    &:hover
      color $color-primary
      cursor pointer
  blockquote
    border-left $color-primary 3px solid
    color $color-text-light-grey
    margin 30px 20px 30px 0px
    padding-left 20px
    font-style italic

  pre
    radius(6px)
    background-color $color-lighter-grey
    max-width 100%
    padding 20px

  img
    display inline-block
    margin 10px
    width 100%
    max-width 160px

  img[data-4c], .fc-image img, .fc-image > img
    display block
    margin 0
    max-width 100%
    padding 0
    width 100%

  .md-bio
    display inline-block
    min-height 100px
    overflow hidden
    padding 10px
    position relative
    width 160px
    img.md-bio--image
      radius(50%)
      reset()
      margin 0 20px
      height 120px
      width 120px
    .md-bio--content
      border-left $color-border 1px solid
      padding 10px
    h5.md-bio--caption
      reset()
      font-size 1em
      font-weight bold
      height 20px
      line-height 20px
      margin 5px 0
      max-width 160px
      overflow hidden
      text-align center
    &.md-bio--with-bio
      radius(6px)
      box-sizing()
      padding 10px
      padding-left 100px
      max-width 100%
      width 100%
      img.md-bio--image
        reset()
        position absolute
        top 10px
        left 10px
        height 80px
        width 80px
      h5.md-bio--caption
        reset()
        height 20px
        max-width 100%
        text-align left
        width 100%
      p.md-bio--bio
        reset()
        color $color-text-grey
        text-align left

</style>
