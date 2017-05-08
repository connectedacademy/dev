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
  visualisation: {},
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
  visualisation() {
    if (!globalState.getters.currentSection) { return {}; }
    return state.visualisation[globalState.getters.currentSection.slug];
  },
  visualisationPoints() {
    if (!globalState.getters.currentSection) { return []; }

    const visualisation = state.visualisation[globalState.getters.currentSection.slug];
    const segmentHeight = (158.0 * 0.2);
    const width = 200.0;

    let points = _.reduce(visualisation, function(result, value, key) {
      // return result + `L${value * width} ${key * segmentHeight} `;
      // return result + `C ${value * width} ${key * segmentHeight + 15}, ${value * width} ${key * segmentHeight - 15}, ${value * width} ${key * segmentHeight} `;
      return result + `S ${value * width} ${key * segmentHeight - 15}, ${value * width} ${key * segmentHeight + 15} `;
      // return result + `M10                       10               C 20                       20,               40                       20,               50                       10`;
      // return result + `M ${value * width} ${key * segmentHeight} `;
      //
    }, "M0 0 ");

    points += `L 0 ${(_.size(visualisation) * segmentHeight)} Z`;

    return points;

  },
  videoIsActive() {
    return (globalState.getters.currentSection !== undefined);
  },
  scrollPoints() {
    return state.scrollPoints;
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
  currentSegmentGroup() {
    if (!globalState.getters.currentSection) { return 0; }
    return _.ceil(globalState.getters.currentSectionScrollPosition / 158.0);
  },
  currentSegment() {
    if (!globalState.getters.currentSection) { return 0; }
    return _.ceil(globalState.getters.currentSectionScrollPosition / (158.0 * 0.2));
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
  getVisualisation({
    commit,
  }, request) {
    API.visualisation.getVisualisation(
      request,
      response => commit(types.GET_VISUALISATION_SUCCESS, {
        response,
      }),
      response => commit(types.GET_VISUALISATION_FAILURE, {
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
  [types.GET_VISUALISATION_SUCCESS](initialState, {
    response,
  }) {
    state.visualisation[response.scope.content] = response.data;
  },
  [types.GET_VISUALISATION_FAILURE](initialState, {
    response,
  }) {
    state.visualisation[response.slug] = {};
    // error in response
  },
  [types.GET_MESSAGES_SUCCESS](initialState, {
    response,
  }) {
    state.messages[response.scope.content] = (state.messages[response.scope.content]) ? state.messages[response.scope.content] : {};
    for (const segment in response.data) {
      state.messages[response.scope.content][_.ceil(segment * 0.2)] = response.data[segment];
    }
  },
  [types.GET_MESSAGES_FAILURE](initialState, {
    response,
  }) {
    // error in response
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
