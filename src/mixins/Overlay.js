import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  methods: {
    dismissOverlay() {
      this.$store.commit(types.DISMISS_AUTH);
      this.$store.commit(types.DISMISS_COMPOSER);
      this.$store.commit(types.DISMISS_LEFT_DRAWER);
      this.$store.commit(types.DISMISS_RIGHT_DRAWER);
      this.$store.commit(types.SET_ACTIVE_SEGMENT, undefined);
    },
  },
}
