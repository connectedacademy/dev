import * as types from '@/store/mutation-types';
import { mapGetters } from 'vuex';

export default {
  methods: {
    dismissOverlay() {
      this.$store.commit(types.DISMISS_AUTH);
      this.$store.commit(types.DISMISS_LIKE);
      this.$store.commit(types.DISMISS_COMPOSER);
      this.$store.commit(types.DISMISS_LEFT_DRAWER);
      this.$store.commit(types.DISMISS_RIGHT_DRAWER);

      if (this.$store.getters.activeSegment) {
        this.$store.commit(types.SET_ACTIVE_SEGMENT, undefined);
      } else {
        this.$store.commit(types.SET_PEEK_SEGMENT, undefined);
      }
    },
  },
}
