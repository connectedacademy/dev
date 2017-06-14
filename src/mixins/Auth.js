import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  methods: {
    showAuth() {
      this.$store.commit(types.SHOW_AUTH);
    },
  },
}
