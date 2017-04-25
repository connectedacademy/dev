/* eslint-disable */
import _ from 'lodash';
import * as types from '../mutation-types';
import API from '../../api';
import globalState from '../index';

// initial state
const state = {
  scrollPoints: {},
};

// getters
const getters = {
  videoIsActive() {
    return (globalState.getters.currentSection !== undefined);
  },
  currentSection() {
    if (!state.scrollPoints) {
      return undefined;
    }

    const scrollPosition = globalState.getters.scrollPosition;

    for (const key in state.scrollPoints ) {
      const scrollPoint = state.scrollPoints[key];
      if ((scrollPosition > scrollPoint.top) && (scrollPosition < scrollPoint.bottom)) {
        return scrollPoint;
      }
    };

    return undefined;
  },
  currentSectionScrollPosition() {
    if (!globalState.getters.currentSection) { return 0; }
    return globalState.getters.scrollPosition - globalState.getters.currentSection.top;
  },
  currentSectionSegment() {
    return _.ceil(globalState.getters.currentSectionScrollPosition / 158);
  },
};

// actions
const actions = {
  clearScrollPoints({ commit }) {
    commit('clearScrollPoints');
  },
  setScrollPoint({ commit }, scrollPoint) {
    commit('setScrollPoint', scrollPoint);
  },
};

// mutations
const mutations = {
  setScrollPoint(initialState, scrollPoint) {
    state.scrollPoints[scrollPoint.label] = scrollPoint;
  },
  clearScrollPoints(initialState) {
    state.scrollPoints = [];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
