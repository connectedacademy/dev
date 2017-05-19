/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '../mutation-types';
import API from '@/api';
import globalState from '../index';

// initial state
const state = {
  messages: {},
  subtitles: {},
  visualisation: {},
};

// getters
const getters = {
  messages() {
    if (!globalState.getters.currentSection) { return []; }

    let messages = state.messages[globalState.getters.currentSection.slug];

    if (!messages) { return new Array(999); }

    const offset = 10;
    let startSegment = ((globalState.getters.currentSegmentGroup - offset) < 0) ? 0 : (globalState.getters.currentSegmentGroup - offset);
    let endSegment = (startSegment + offset);

    messages = _.fill(messages, undefined, 0, startSegment);
    messages = _.fill(messages, undefined, (endSegment + offset), (messages.length - 1));

    // console.log(`startSegment - ${startSegment} + endSegment - ${endSegment} + messages.length - ${messages.length}`);

    return messages;
  },
  chunkedMessages() {

    let messages = _.compact(globalState.getters.messages);

    const chunkedMessages = _.reduce(messages, function(obj, param) {
      obj[param.segmentGroup] = param;
      return obj;
    }, {});

    return chunkedMessages;
  },
  subtitles() {
    if (!globalState.getters.currentSection) { return {}; }
    return state.subtitles[globalState.getters.currentSection.slug];
  },
  visualisation() {
    if (!globalState.getters.currentSection) { return {}; }
    return state.visualisation[globalState.getters.currentSection.slug];
  },
  // visualisationPoints() {
  //
  //   let points = "M0 0 ";
  //
  //   if (!globalState.getters.currentSection) { return points; }
  //
  //   let visualisation = state.visualisation[globalState.getters.currentSection.slug];
  //
  //   console.log('loading vis');
  //   // let visualisation = state.visualisation['liveclass'];
  //
  //   const segmentHeight = 158.0;
  //   const handleOffset = (segmentHeight / 4.0);
  //   const width = 200.0;
  //   const parentOffsetTop = (segmentHeight / 2.0);
  //
  //   let chunkedVis = _.chunk(_.values(visualisation), 5);
  //
  //   function summit(val, key) {
  //     return _.mean(val);
  //   }
  //
  //   chunkedVis = _.map(chunkedVis, summit);
  //
  //   _.forEach(chunkedVis, function(value, index) {
  //     const offsetTop = (index * segmentHeight) + parentOffsetTop;
  //     points += `S ${value * width} ${offsetTop - handleOffset}, ${value * width} ${offsetTop} `;
  //   });
  //
  //   points += `L 0 ${(_.size(chunkedVis) * segmentHeight)} Z`;
  //   return points;
  // },
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
  currentActiveSection() {
    if (globalState.state.scrollPoints.length === 0) { return undefined; }

    const offsetScrollPosition = globalState.state.scrollPosition;

    for (const key in globalState.state.scrollPoints ) {
      const scrollPoint = globalState.state.scrollPoints[key];
      if ((offsetScrollPosition > scrollPoint.sectionTop) && (offsetScrollPosition < scrollPoint.bottom)) {
        return scrollPoint;
      }
    };

    return undefined;
  },
  currentSectionScrollPosition() {
    if (!globalState.getters.currentSection) { return 0; }
    return globalState.state.offsetScrollPosition - globalState.getters.currentSection.top;
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
    state.messages[request.theContent] = (state.messages[request.theContent]) ? state.messages[request.theContent] : new Array(999);

    const segmentGroup = parseInt(parseInt(request.startSegment) * 0.2);

    state.messages[request.theContent][segmentGroup] = {
      loading: true,
      segmentGroup: segmentGroup,
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
    state.messages[response.scope.content][parseInt(parseInt(response.scope.startsegment) * 0.2)] = response.data;
    state.messages[response.scope.content][parseInt(parseInt(response.scope.startsegment) * 0.2)].segmentGroup = parseInt(parseInt(response.scope.startsegment) * 0.2);
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
