/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '../mutation-types';
import API from '@/api';
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
    // TODO: Viewport limited

    let messages = state.messages[globalState.getters.currentSection.slug];

    messages = _.filter(messages, function(value, key) {

      console.log('key');
      console.log(key);

      console.log('(globalState.getters.currentSegmentGroup)');
      console.log(globalState.getters.currentSegmentGroup);

      // return true;
      return ((parseInt(key) < globalState.getters.currentSegmentGroup) && (parseInt(key) > (globalState.getters.currentSegmentGroup - 4)))
    });


    return messages;
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

    let visualisation = state.visualisation[globalState.getters.currentSection.slug];

    const segmentHeight = 158.0;
    const handleOffset = (segmentHeight / 4.0);
    const width = 200.0;
    const parentOffsetTop = (segmentHeight / 2.0);

    let chunkedVis = _.chunk(_.values(visualisation), 5);

    function summit(val, key) {
      return _.mean(val);
    }

    chunkedVis = _.map(chunkedVis, summit);

    let points = "M0 0 ";

    _.forEach(chunkedVis, function(value, index) {
      const offsetTop = (index * segmentHeight) + parentOffsetTop;
      points += `S ${value * width} ${offsetTop - handleOffset}, ${value * width} ${offsetTop} `;
    });

    points += `L 0 ${(_.size(chunkedVis) * segmentHeight)} Z`;

    return points;
  },
  visualisationLabels() {
    if (!globalState.getters.currentSection) { return []; }

    let visualisation = state.visualisation[globalState.getters.currentSection.slug];

    const segmentHeight = 158.0;
    const offsetTop = (segmentHeight / 2.0);

    let chunkedVis = _.chunk(_.values(visualisation), 5);

    function summit(val, key) {
      return _.sum(val);
    }

    chunkedVis = _.map(chunkedVis, summit);

    let labels = "";

    _.forEach(chunkedVis, function(value, index) {
        labels += `<text text-anchor="middle" alignment-baseline="central" x="100" y="${(index * segmentHeight) + offsetTop}" fill="black" font-size="16">${index} - ${_.round(value, 2)}</text>`;
    });

    return labels;
  },
  videoIsActive() {
    if (globalState.getters.currentSection === undefined) {
      return false;
    }
    return (globalState.getters.currentSection.duration !== undefined);
  },
  scrollPoints() {
    return state.scrollPoints;
  },
  currentActiveSection() {
    if (state.scrollPoints.length === 0) { return undefined; }

    const offsetScrollPosition = globalState.getters.scrollPosition;

    for (const key in state.scrollPoints ) {
      const scrollPoint = state.scrollPoints[key];
      if ((offsetScrollPosition > scrollPoint.sectionTop) && (offsetScrollPosition < scrollPoint.bottom)) {
        return scrollPoint;
      }
    };

    return undefined;
  },
  currentSection() {
    if (state.scrollPoints.length === 0) { return undefined; }

    const offsetScrollPosition = globalState.getters.offsetScrollPosition;

    for (const key in state.scrollPoints ) {
      const scrollPoint = state.scrollPoints[key];
      if ((offsetScrollPosition > scrollPoint.top) && (offsetScrollPosition < scrollPoint.bottom)) {
        if (_.includes(['class', 'webinar'], scrollPoint.content_type)) {
          return scrollPoint;
        }
      }
    };

    return undefined;
  },
  currentSectionScrollPosition() {
    if (!globalState.getters.currentSection) { return 0; }
    return globalState.getters.offsetScrollPosition - globalState.getters.currentSection.top;
  },
  currentSegmentGroup() {
    if (!globalState.getters.currentSection) { return -1; }
    return _.floor(globalState.getters.currentSectionScrollPosition / 158.0);
  },
  currentSegment() {
    if (!globalState.getters.currentSection) { return 0; }
    return _.floor(globalState.getters.currentSectionScrollPosition / (158.0 * 0.2));
  },
};

// actions
const actions = {
  getMessagesSummary({
    commit,
  }, request) {
    state.messages[request.theContent] = (state.messages[request.theContent]) ? state.messages[request.theContent] : {};

    state.messages[request.theContent][`${request.startSegment * 0.2}`] = {
      loading: true,
    };

    API.message.getMessagesSummary(
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
  resetScrollPoints(initialState) {
    state.scrollPoints = {};
  },
  setScrollPoint(initialState, scrollPoint) {
    state.scrollPoints[scrollPoint.slug] = scrollPoint;
    state.scrollPoints = initialState.scrollPoints;
    console.log('Recalculating scroll points');
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
    if (response.data.message) {
      state.messages[response.scope.content] = (state.messages[response.scope.content]) ? state.messages[response.scope.content] : {};

      state.messages[response.scope.content][response.scope.startsegment * 0.2] = {
        message: response.data.message,
        info: {
          count: response.data.info.total,
        },
      };
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
