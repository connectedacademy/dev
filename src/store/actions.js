import Vue from 'vue';
import store from '@/store';
import find from 'lodash/find';

export const setScrollPosition = ({ commit }, scrollPosition) => {
  commit('setScrollPosition', scrollPosition);
};

export const setCurrentSection = ({ commit }) => {
  
  if (store.state.scrollPoints.length === 0) return;
  
  let currentSection = undefined;
  const offsetScrollPosition = store.state.offsetScrollPosition;
  // const scrollPoints = find(store.state.scrollPoints, { content_type: 'class' });
  const scrollPoints = store.state.scrollPoints;

  for (const key in scrollPoints) {
    const scrollPoint = store.state.scrollPoints[key];
    if ((offsetScrollPosition > scrollPoint.top) && (offsetScrollPosition < scrollPoint.bottom)) {
      if (scrollPoint.content_type === 'class') {
        currentSection = scrollPoint;
        continue;
      }
    }
  };
  
  commit('setCurrentSection', currentSection);

};

export const saveScrollPosition = ({ commit }) => {
  commit('setSavedScrollPosition', store.state.scrollPosition);
};

export const resetState = ({ commit }) => {
  Vue.$log.info('Reseting store.state...');
  commit('resetScrollPoints');
  // commit('setScrollPosition', 0);
};

export default setScrollPosition;
