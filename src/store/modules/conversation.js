import * as types from '../mutation-types';
import API from '../../api';
import globalState from '../index';

// initial state
const state = {
  segment_id: undefined,
  video_src: '',
  scrollPoints: [],
};

// getters
const getters = {
  segementId() {
    return state.segment_id;
  },
  videoId() {
    return '123';
  },
  videoIsActive() {
    return (this.currentSection === 'webinar');
  },
  currentSection() {
    if (state.scrollPoints.length === 0) {
      return 'no points';
    }
    for (let i = (state.scrollPoints.length - 1); i > -1; i -= 1) {
      if (globalState.scrollPosition > state.scrollPoints[i].position) {
        return state.scrollPoints[i].label;
      }
    }

    return 'no section';
  },
};

// actions
const actions = {
  addScrollPoint({ commit }, scrollPoint) {
    commit('addScrollPoint', scrollPoint);
  },
};

// mutations
const mutations = {
  addScrollPoint(initialState, scrollPoint) {
    state.scrollPoints.push(scrollPoint);
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
