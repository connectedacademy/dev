import { mapGetters } from 'vuex'
import { Events } from '@/events.js'

// Mixins
import PageStyle from '@/mixins/PageStyle'

// Components
import MarkdownRenderer from '@/components/markdown/MarkdownRenderer'

export default {
  mixins: [PageStyle],
  components: {
    MarkdownRenderer
  },
  computed: {
    ...mapGetters(['CDN'])
  }
}