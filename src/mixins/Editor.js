import API from '@/api'
import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  data() {
    return {
      expanded: false,
      updating: false,
      state: {
        audio: {
          introAudioFile: 'waiting',
          mainAudioFile: 'waiting'
        },
        transcript: 'waiting'
      }
    }
  },
  computed: {
    ...mapGetters(['course', 'CDN'])
  },
  methods: {
    loadProperties(source) {
      if (!source) return
      console.log('source', source)
      
      for (const property in source) {
        if (this.properties[property]) {
          this.properties[property].value = source[property]
        }
      }
    },
    uploadAudioFile(identifer) {
      const formData = new FormData()

      formData.append('theClass', this.$route.params.classSlug)
      formData.append('upload', this.$refs[identifer].files[0])
      formData.append('type', identifer)

      this.state.audio[identifer] = 'processing'

      API.course.uploadAudio(
        formData,
        (response) => {
          this.state.audio[identifer] = 'waiting'
        },
        (response) => {
          console.log(response)
          this.state.audio[identifer] = 'waiting'
        }
      )
    },
    loadMarkdown(url) {
      if (!url) return

      API.markdown.fetchMarkdown(
        url,
        (response) => {
          this.markdown = response
        },
        (response) => {
          this.$log.error(response)
          this.$log.info('Failed to fetch markdown')
          this.markdown = ''
        }
      )
    },
    async update(type, index) {
      
      this.updating = true
      await sleep(500)

      let request = {
        type
      }
      
      switch (type) {
        case 'course':
          request = Object.assign(request, {
            properties: {
              title: this.properties.title.value,
              hashtag: this.properties.hashtag.value,
              image: this.properties.image.value,
              imagecredit: this.properties.imagecredit.value
            }
          })
          break

        case 'content':
          request = Object.assign(request, {
            index: index,
            class: this.$route.params.classSlug,
            properties: {
              title: this.properties.title.value,
              description: this.properties.description.value
            }
          })
          break
        
        case 'page':
          request = Object.assign(request, {
            markdown: this.markdown,
            path: this.page.path
          })
          break

        case 'schedule':
          request = Object.assign(request, {
            index: index,
            properties: {
              title: this.properties.title.value,
              description: this.properties.description.value,
              slug: this.properties.slug.value,
              date: this.properties.date.value
            }
          })
          break
      }

      API.editor.save(
        request,
        (response) => {
          // this.$log.info('Updated!')
          // this.$log.info(response)
          Events.$emit('contentUpdated', request.type)
          this.updating = false
        },
        (response) => {
          // this.$log.error(response)
          // this.$log.info('Failed to update')
          this.updating = false
          alert('Failed to update page')
        })
    }
  }
}
