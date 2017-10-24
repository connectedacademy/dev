import Vue from 'vue';
import store from '@/store';
import find from 'lodash/find';

export const saveScrollPosition = ({ commit }, scrollPosition) => {
  commit('setSavedScrollPosition', scrollPosition);
};

export const resetState = ({ commit }) => {
  Vue.$log.info('Reseting store.state...');
  commit('resetScrollPoints');
};

export default saveScrollPosition;
