<template lang="pug">

.rendered-markdown(v-html="renderedMarkdown")

</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownItCustomBlock from 'markdown-it-custom-block'

import API from '@/api'
import * as types from '@/store/mutation-types'

export default {
  name: 'markdown-content',
  props: ['markdown'],
  data() {
    return {
      renderedMarkdown: ''
    }
  },
  watch: {
    markdown() {
      this.renderMarkdown()
    }
  },
  mounted() {
    this.renderMarkdown()
  },
  methods: {
    renderMarkdown() {

      const md = new MarkdownIt()
        .use(MarkdownItCustomBlock, {
          bio(arg) {
            if (!arg) return 'loading...'

            const parts = arg.split('|')

            const caption = parts[0] ? parts[0].trim() : ''
            const image = parts[1] ? parts[1].trim() : ''

            if (parts.length > 2) {
              const bio = parts[2] ? parts[2].trim() : ''
              const link = parts[3] ? parts[3].trim() : ''

              const imageElement = (image !== 'default') ? `<img class="md-bio--image" src="${image}" />` : '<div class="md-bio--image"></div>'

              return `
              <div class="md-bio md-bio--with-bio">
                ${imageElement}
                <div class="md-bio--content">
                  <h5 class="md-bio--caption">${caption}</h5>
                  <p class="md-bio--bio">${bio}</p>
                  <a href="${link}" target="_blank" class="md-bio--link">${link}</a>
                </div>
              </div>
              `

            } else {

              return `
              <div class="md-bio">
                ${imageElement}
                <h5 class="md-bio--caption">${caption}</h5>
              </div>
              `

            }
          },
      })

      this.renderedMarkdown = md.render(this.markdown.replace("@","\n\n@"))
    },
  },
}
</script>

<style lang="stylus" scoped>

@import '~stylus/shared'

.rendered-markdown
  h1
    reset()
    color $color-text-dark-grey
    margin-bottom 5px
  h1, h2, h3, h4, h5, p, a, li
    color $color-text-dark-grey

</style>
