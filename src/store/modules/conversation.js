/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '../mutation-types';
import API from '../../api';
import globalState from '../index';

// initial state
const state = {
  scrollPoints: {},
  subtitles: [],
};

// getters
const getters = {
  subtitles() {
    return state.subtitles;
  },
  videoIsActive() {
    return (globalState.getters.currentSection !== undefined);
  },
  currentSection() {
    if (state.scrollPoints.length === 0) { return undefined; }

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
  currentVideoTime() {
    if (!globalState.getters.currentSection) { return 0; }
    return (globalState.getters.currentSectionScrollPosition / 158);
  },
  currentSectionSegment() {
    if (!globalState.getters.currentSection) { return 0; }
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
  getSubtitles({
    commit,
  }) {
    API.message.getSubtitles(
      `${globalState.getters.course.baseUri}${globalState.getters.currentClass.dir}/${globalState.getters.currentSection.transcript}`,
      response => commit(types.GET_SUBTITLES_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SUBTITLES_FAILURE, {
        response,
      }),
    );
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
  [types.GET_SUBTITLES_SUCCESS](initialState, {
    response,
  }) {
    state.subtitles = response;
  },
  [types.GET_SUBTITLES_FAILURE](initialState, {
    response,
  }) {
    state.subtitles = [];
    // error in response
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
