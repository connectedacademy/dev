import _ from 'lodash';
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
  videoIsActive() {
    return (globalState.getters.currentSection !== undefined);
  },
  currentSection() {
    if (state.scrollPoints.length === 0) {
      return undefined;
    }
    for (let i = (state.scrollPoints.length - 1); i > -1; i -= 1) {
      if (globalState.getters.scrollPosition > state.scrollPoints[i].position) {
        return state.scrollPoints[i];
      }
    }

    return undefined;
  },
  currentSectionScrollPosition() {
    if (!globalState.getters.currentSection) {
      return 0;
    }
    return globalState.getters.scrollPosition - globalState.getters.currentSection.position;
  },
  currentSectionSegment() {
    return _.ceil(globalState.getters.currentSectionScrollPosition / 158);
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
