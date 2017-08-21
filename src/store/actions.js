import Vue from 'vue';
import store from '@/store';

export const setScrollPosition = ({ commit }, scrollPosition) => {

  // Vue.$log.info('Setting scroll position from action');

  // Set current section
  let currentSection = undefined;

  if (store.state.scrollPoints.length !== 0) {
    const offsetScrollPosition = store.state.offsetScrollPosition;

    for (const key in store.state.scrollPoints ) {
      const scrollPoint = store.state.scrollPoints[key];
      if ((offsetScrollPosition > scrollPoint.top) && (offsetScrollPosition < scrollPoint.bottom)) {
        if (scrollPoint.content_type === 'class') {
          currentSection = scrollPoint;
          continue;
        }
      }
    };
  }

  commit('setCurrentSection', currentSection);
  commit('setScrollPosition', scrollPosition);
};

export const resetState = ({ commit }) => {
  Vue.$log.info('Reseting store.state...');
  commit('resetScrollPoints');
  // commit('setScrollPosition', 0);
};

export default setScrollPosition;
