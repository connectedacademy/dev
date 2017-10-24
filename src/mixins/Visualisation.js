import API from '@/api';
import { mapGetters } from 'vuex';

export default {
  props: ['content'],
  data() {
    return {
      visualisation: undefined,
    };
  },
  computed: {
    ...mapGetters(['currentClass']),
  },
  methods: {
    loadVisualisation() {

      const request = { class: this.currentClass.slug, content: this.content.slug };

      API.visualisation.getVisualisation(
        request,
        (response) => {
          this.visualisation = response.data;
        },
        response => (response) => {
          this.visualisation = undefined;
        },
      );
    },
  },
}
