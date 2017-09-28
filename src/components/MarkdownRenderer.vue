<template lang="pug">

.markdown-wrapper

  .rendered-markdown(ref="renderedmarkdown")
    p {{ $t('common.loading') }}

</template>

<script>
  import Auth from '@/mixins/Auth';
  
  import MarkdownIt from 'markdown-it';
  import MarkdownItReplaceLink from 'markdown-it-replace-link';
  import MarkdownItVideo from 'markdown-it-video';
  import MarkdownItFrontMatter from 'markdown-it-front-matter';
  import MarkdownItCustomBlock from 'markdown-it-custom-block';
  
  import Vue from 'vue';
  import API from '@/api';
  
  import startsWith from 'lodash/startsWith';
  import endsWith from 'lodash/endsWith';
  
  const FourCornersLib = require('fourcorners');
  
  export default {
    name: 'markdown-renderer',
    mixins: [
      Auth,
    ],
    watch: {
      markdownUrl(nV) {
        this.loadMarkdown();
      },
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
    props: ['markdownUrl'],
    data() {
      return {
        loading: true,
        renderedMarkdown: 'Loading...',
        frontMatter: {}
      };
    },
    methods: {
      getUrl() {
        if (this.markdownUrl) {
          return this.markdownUrl;
        }
        let url = this.$route.params.url;
        if (startsWith(url, 'http')) {
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
          data() {
            return {
              fourcornersLink: '',
              submitting: false,
              submitted: false,
            };
          },
          computed: {
            contentUrl() {
              return `${window.location.protocol}//${window.location.host}/#/submission/${parent.theClass}/${parent.theContent}`;
            },
          },
          methods: {
            goToLink(href) {
              this.$router.push(href.replace('/#/markdown', '/markdown'));
            },
          },
          render: res.render,
          staticRenderFns: res.staticRenderFns,
        }).$mount();
  
        this.$refs.renderedmarkdown.replaceChild(RenderedMarkdown.$el, this.$refs.renderedmarkdown.childNodes[0]);
  
        setTimeout(() => {
          FourCornersLib.init();
        }, 1000);
      },
    },
    computed: {
      rawMarkdown() {
  
        var parent = this;
  
        const md = new MarkdownIt({
            html: true,
            linkify: true,
            replaceLink: (link, env) => {
  
              if (startsWith(link, 'http')) {
                return link;
              }
              if (endsWith(link, '.md')) {
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
            youtube: {
              width: 640,
              height: 390
            },
            vimeo: {
              width: 500,
              height: 281
            },
          })
          .use(MarkdownItFrontMatter, (fm) => {
            this.frontMatter = fm;
          })
          .use(MarkdownItCustomBlock, {
            bio(arg) {
              if (!arg) {
                return 'loading...';
              }
  
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
  white-space initial
  word-wrap break-word
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
    white-space initial
    word-wrap break-word

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
