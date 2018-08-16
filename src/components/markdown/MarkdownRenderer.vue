<template lang="pug">

.markdown-wrapper(v-if="renderedMarkdown")
  .rendered-markdown(ref="renderedmarkdown" :class="{ loading: loading }")
    .loading-symbol
      icon(icon="circle-notch")

</template>

<script>
  import { mapGetters } from 'vuex'
  import { Events } from '@/events.js'
  
  import Auth from '@/mixins/Auth'
  
  import MarkdownIt from 'markdown-it'
  import MarkdownItReplaceLink from 'markdown-it-replace-link'
  import MarkdownItVideo from 'markdown-it-video'
  import MarkdownItFrontMatter from 'markdown-it-front-matter'
  import MarkdownItCustomBlock from 'markdown-it-custom-block'
  
  import Vue from 'vue'
  import API from '@/api'
  
  import startsWith from 'lodash/startsWith'
  import endsWith from 'lodash/endsWith'
  
  const FourCornersLib = require('fourcorners')
  
  export default {
    name: 'markdown-renderer',
    mixins: [
      Auth,
    ],
    watch: {
      markdownUrl(nV) {
        this.loadMarkdown()
      },
      '$route': {
        handler: function(nV, oV) {
          this.loadMarkdown()
        },
        deep: true,
      },
    },
    mounted() {
      this.loadMarkdown()
      Events.$on('contentUpdated', (type) => {
        if (['page', 'markdown'].indexOf(type) === -1) return
        this.loadMarkdown()
      })
    },
    beforeDestroy() {
      Events.$off('contentUpdated')
    },
    props: ['markdownUrl'],
    data() {
      return {
        loading: true,
        renderedMarkdown: 'Loading...',
        frontMatter: {}
      }
    },
    computed: {
      ...mapGetters(['course', 'CDN'])
    },
    methods: {
      getUrl() {
        if (this.markdownUrl) {
          return this.markdownUrl
        }
        return `${this.CDN}/classes/${this.$route.params.classSlug}/${this.$route.params.url}.md`
      },
      loadMarkdown() {

        this.loading = true
        const url = this.getUrl()

        if (!url) return
    
        API.markdown.fetchMarkdown(
          url,
          (response) => {
            let markdown = response
            markdown = markdown.replace('@[bio]', '\n\n\n@[bio]')
            markdown = markdown.replace(/CDN_URL/g, this.CDN)
            this.renderedMarkdown = markdown
            
            this.loading = false
            this.renderMarkdown()
          },
          (response) => {
            this.$log.error(response)
            this.$log.info('Failed to fetch markdown')
            this.renderedMarkdown = ''
            this.loading = false
          },
        )
      },
      renderMarkdown() {
  
        this.$log.info('Rendering markdown')
  
        // Render markdown
        var res = Vue.compile(this.rawMarkdown())
  
        var parent = this
        var RenderedMarkdown = new Vue({
          name: 'rendered-markdown',
          parent: this,
          data() {
            return {
              fourcornersLink: '',
              submitting: false,
              submitted: false,
            }
          },
          computed: {
            contentUrl() {
              return `${window.location.protocol}//${window.location.host}/submission/${parent.theClass}/${parent.theContent}`
            },
          },
          methods: {
            goToLink(href) {
              this.$router.push(href)
            },
          },
          render: res.render,
          staticRenderFns: res.staticRenderFns,
        }).$mount()
  
        if (typeof this.$refs.renderedmarkdown !== 'undefined') {
          this.$refs.renderedmarkdown.replaceChild(RenderedMarkdown.$el, this.$refs.renderedmarkdown.childNodes[0])
        }
        
        this.$nextTick(() => {
          FourCornersLib.init()
        })
      },
      rawMarkdown() {
  
        var parent = this
  
        const md = new MarkdownIt({
            html: true,
            linkify: true,
            replaceLink: (link, env) => {
  
              if (startsWith(link, 'http') || startsWith(link, 'www')) {
                return link
              }
              if (endsWith(link, '.md')) {
                const url = this.getUrl()
                const currentUrl = url.substring(0, url.lastIndexOf('/') + 1)
                return `/content/${encodeURIComponent(link)}`
              }
  
              if (!this.$store.getters.course) {
                return ''
              } else {
                return `${this.CDN}/content/${link}`
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
            this.frontMatter = fm
          })
          .use(MarkdownItCustomBlock, {
            bio(arg) {
              if (!arg) {
                return 'loading...'
              }
  
              const parts = arg.split('|')

              console.log(parts)
  
              const captionElement = (parts.length > 0) ? `<h5 class="md-bio--caption">${parts[0].trim()}</h5>` : ''
              const image = (parts.length > 1) ? parts[1].trim() : 'default'
              const imageElement = (image !== 'default') ? `<img class="md-bio--image" src="${image}" />` : '<div class="md-bio--image"></div>'
              const bioElement = (parts.length > 2) ? `<p class="md-bio--bio">${parts[2].trim()}</p>` : ''
              const linkElement = (parts.length > 3) ? `<a href="${parts[3].trim()}" target="_blank" class="md-bio--link">${parts[3].trim()}</a>` : ''
              
              if (parts.length > 2) {
                return `
                <div class="md-bio md-bio--with-bio">
                  ${imageElement}
                  <div class="md-bio--content">
                    ${captionElement}
                    ${bioElement}
                    ${linkElement}
                  </div>
                </div>
                `
              } else {
                return `
                <div class="md-bio">
                  ${imageElement}
                  ${captionElement}
                </div>
                `
              }
            },
          })
  
        md.renderer.rules.link_open = (tokens, idx) => {
          const href = md.utils.escapeHtml(tokens[idx].attrs[0][1])
          if (startsWith(href, 'http') || startsWith(href, 'www')) {
            // Absolute link so do nothing
            return `<a href="${href}" target="_blank">`
          } else {
            // Relative link so replace with Vue navigation
            return `<a v-on:click="goToLink('${href}')">`
          }
        }
        
        return `<div>${md.render(this.renderedMarkdown)}</div>`
      },
    },
  }
</script>

<style lang="stylus" scoped>

.rendered-markdown
  .loading-symbol
    display none
    svg
      color #CCC
      padding 20px
  &.loading
    text-align center
    .loading-symbol
      display block
</style>

