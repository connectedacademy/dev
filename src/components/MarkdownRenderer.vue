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

import FourCorners from '@/mixins/FourCorners';

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
    FourCorners,
  ],
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
    rawMarkdown() {
      this.loadFourCornersScript();
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

      console.log('Rendering markdown');

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
              console.log('Submission check response');
              console.log(response);
              this.checkingSubmissions = false;
              this.submitted = (response.data.length === 0) ? false : true;
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
            let sub = window.location.host.split('.')[0];
            sub = (_.startsWith(sub, 'localhost')) ? 'testclass' : sub;

            return `https://${sub}.connectedacademy.io/#/submission/${parent.theClass}/${parent.theContent}`;
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
            this.$router.push(href.replace('/#/markdown','/markdown'));
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
        submission(arg) {

          console.log('Plain arg');
          console.log(arg);

          // arg = JSON.parse(arg);

          console.log('JSON arg');
          console.log(arg);

          if (arg.type === 'fourcorners') {
            parent.theClass = arg.class;
            parent.theContent = arg.content;
            return `
            <div class="fourcorners-submission fourcorners-submission-checking" v-if="checkingSubmissions">
              <h2>Checking submissions...</h2>
            </div>

            <div class="fourcorners-submission fourcorners-submission-submitting" v-if="submitting">
              <h2>Submitting...</h2>
            </div>

            <div class="fourcorners-submission fourcorners-submission-submitted" v-if="submitted">
              <h2>Thank you for your submission!</h2>
            </div>

            <div class="fourcorners-submission fourcorners-submission-submit" v-if="isRegistered && !checkingSubmissions && !submitting && !submitted">
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
  &.fourcorners-submission-submit
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
  &.fourcorners-submission-submitted, &.fourcorners-submission-submitting, &.fourcorners-submission-checking
    text-align center
    h2
      nomargin()
      color white !important
      padding 40px
  &.fourcorners-submission-submitting, &.fourcorners-submission-checking
    background-color $color-light-grey
    h2
      color $color-text-dark-grey !important
  &.fourcorners-submission-submitted
    background-color $color-success

</style>
