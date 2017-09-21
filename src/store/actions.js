import Vue from 'vue';
import store from '@/store';
import find from 'lodash/find';

export const setScrollPosition = ({ commit }, scrollPosition) => {

  commit('setScrollPosition', scrollPosition);

  if (store.state.scrollPoints.length === 0) return;

  const offsetScrollPosition = store.state.offsetScrollPosition;
  const scrollPoint = find(store.state.scrollPoints, { content_type: 'class' });
  
  if (scrollPoint && (offsetScrollPosition > scrollPoint.top) && (offsetScrollPosition < scrollPoint.bottom)) {
    commit('setCurrentSection', scrollPoint);
  } else {
    commit('setCurrentSection', undefined);
  }
};

export const setCurrentSection = ({ commit }) => {
};

export const saveScrollPosition = ({ commit }) => {
  commit('setSavedScrollPosition', store.state.scrollPosition);
};

export const resetState = ({ commit }) => {
  Vue.$log.info('Reseting store.state...');
  commit('resetScrollPoints');
  commit('setScrollPosition', 0);
};

export default setScrollPosition;
