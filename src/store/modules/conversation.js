/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '../mutation-types';
import API from '../../api';
import globalState from '../index';

// initial state
const state = {
  scrollPoints: {},
  messages: {},
  subtitles: {},
};

// getters
const getters = {
  messages() {
    if (!globalState.getters.currentSection) { return {}; }
    return state.messages[globalState.getters.currentSection.slug];
  },
  subtitles() {
    if (!globalState.getters.currentSection) { return {}; }
    return state.subtitles[globalState.getters.currentSection.slug];
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
  currentSectionSegment() {
    if (!globalState.getters.currentSection) { return 0; }
    return _.round(globalState.getters.currentSectionScrollPosition / (158.0 * 1.0));
  },
};

// actions
const actions = {
  getMessages({
    commit,
  }, request) {
    API.message.getMessages(
      request,
      response => commit(types.GET_MESSAGES_SUCCESS, {
        response,
      }),
      response => commit(types.GET_MESSAGES_FAILURE, {
        response,
      }),
    );
  },
  getSubtitles({
    commit,
  }) {
    API.message.getSubtitles(
      `${globalState.getters.currentSection.slug}`,
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
    state.scrollPoints[scrollPoint.slug] = scrollPoint;
  },
  clearScrollPoints(initialState) {
    state.scrollPoints = [];
  },
  [types.GET_SUBTITLES_SUCCESS](initialState, {
    response,
  }) {
    state.subtitles[response.slug] = response.response;
  },
  [types.GET_SUBTITLES_FAILURE](initialState, {
    response,
  }) {
    state.subtitles[response.slug] = [];
    // error in response
  },
  [types.GET_MESSAGES_SUCCESS](initialState, {
    response,
  }) {
    state.messages[response.scope.content] = (state.messages[response.scope.content]) ? state.messages[response.scope.content] : {};
    for (const segment in response.data) {
      state.messages[response.scope.content][segment] = response.data[segment];
    }
  },
  [types.GET_MESSAGES_FAILURE](initialState, {
    response,
  }) {
    state.messages[response.scope.content] = {};
    // error in response
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
