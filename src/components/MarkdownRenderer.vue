<template lang="pug">

.markdown-wrapper

  .rendered-markdown(ref="renderedmarkdown")
    p(v-if="loading") {{ $t('common.loading') }}

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
        if (!url) {
          return undefined;
        }
        if (startsWith(url, 'http') || startsWith(url, 'www')) {
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

        const url = this.getUrl();
        if (!url) return;

        API.markdown.fetchMarkdown(
          url,
          (response) => {
            this.renderedMarkdown = response;
            this.loading = false;
            this.renderMarkdown();
          },
          (response) => {
            this.$log.error(response)
            this.$log.info('Failed to fetch markdown')
            this.renderedMarkdown = '';
            this.loading = false;
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
  
        if (typeof this.$refs.renderedmarkdown !== 'undefined') {
          this.$refs.renderedmarkdown.replaceChild(RenderedMarkdown.$el, this.$refs.renderedmarkdown.childNodes[0]);
        }
        
        this.$nextTick(() => {
          FourCornersLib.init();
        });
      },
    },
    computed: {
      rawMarkdown() {
  
        var parent = this;
  
        const md = new MarkdownIt({
            html: true,
            linkify: true,
            replaceLink: (link, env) => {
  
              if (startsWith(link, 'http') || startsWith(link, 'www')) {
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
          if (startsWith(href, 'http') || startsWith(href, 'www')) {
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
