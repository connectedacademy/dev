/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '@/store/mutation-types';
import API from '@/api';
import store from '@/store';;

// initial state
const state = {
  messages: new Array(999),
  visualisation: [],
  activeSegment: undefined,
  activeSegmentVisible: false,
};

// getters
const getters = {
  activeSegment() {
    return state.activeSegment;
  },
  activeSegmentVisible() {
    return state.activeSegmentVisible;
  },
  messages() {
    if (!store.getters.currentSection) { return []; }

    let messages = state.messages;

    // const offset = 3;
    // let startSegment = ((store.getters.currentSegmentGroup - offset) < 0) ? 0 : (store.getters.currentSegmentGroup - offset);
    // let endSegment = (startSegment + offset);

    // messages = _.fill(messages, undefined, 0, startSegment);
    // messages = _.fill(messages, undefined, (endSegment + offset), (messages.length - 1));

    // Vue.log.log(`startSegment - ${startSegment} + endSegment - ${endSegment} + messages.length - ${messages.length}`);

    // const chunkedMessages = messages.slice(startSegment, endSegment);

    return messages;
  },
  subtitles() {
    Vue.log.log('Subtitles from state');
    return state.subtitles;
  },
  visualisation() {
    Vue.log.log('Visualisation from state');
    return state.visualisation;
  },
  videoIsActive() {
    if (store.getters.currentSection === undefined) {
      return false;
    }
    return (store.getters.currentSection.duration !== undefined);
  },
  currentActiveSection() {
    if (store.state.scrollPoints.length === 0) { return undefined; }

    const offsetScrollPosition = store.state.scrollPosition;

    for (const key in store.state.scrollPoints ) {
      const scrollPoint = store.state.scrollPoints[key];
      if ((offsetScrollPosition > scrollPoint.sectionTop) && (offsetScrollPosition < scrollPoint.bottom)) {
        return scrollPoint;
      }
    };

    return undefined;
  },
  currentSectionScrollPosition() {
    if (!store.getters.currentSection) { return 0; }
    return store.state.offsetScrollPosition - store.getters.currentSection.top;
  },
  currentSegmentGroup() {
    if (!store.getters.currentSection) { return -1; }
    return _.floor(store.getters.currentSectionScrollPosition / 158.0);
  },
  currentSegment() {
    if (!store.getters.currentSection) { return 0; }
    return _.floor(store.getters.currentSectionScrollPosition / (158.0 * 0.2));
  },
};

// actions
const actions = {
  getMessagesSummary({
    commit,
  }, request) {

    const startSegmentGroup = parseInt(parseInt(request.startSegment) * 0.2);
    const endSegmentGroup = parseInt(parseInt(request.endSegment) * 0.2);

    // Vue.log.log(`** API request ${startSegmentGroup} - ${endSegmentGroup}`);
    // Vue.log.log(request);

    let segmentCount = (endSegmentGroup - startSegmentGroup);
    let segmentIterator = 0;

    while (segmentIterator < segmentCount) {
      const currentSegmentGroup = startSegmentGroup + segmentIterator;
      const loading = {
        loading: true,
        segmentGroup: currentSegmentGroup,
      };

      Vue.set(state.messages, `${currentSegmentGroup}`, loading);
      segmentIterator += 1;
    }

    API.message.getMessagesSummaryBatch(
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
      `${store.getters.currentSection.slug}`,
      `${store.getters.course.baseUri}${store.getters.currentClass.dir}/${store.getters.currentSection.transcript}`,
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
    state.subtitles = response.response;
  },
  [types.GET_SUBTITLES_FAILURE](initialState, {
    response,
  }) {
    state.subtitles = [];
    // error in response
  },
  [types.GET_VISUALISATION_SUCCESS](initialState, {
    response,
  }) {
    state.visualisation = response.data;
  },
  [types.GET_VISUALISATION_FAILURE](initialState, {
    response,
  }) {
    Vue.log.log('error');
    state.visualisation = [];
    // error in response
  },
  [types.GET_MESSAGES_SUCCESS](initialState, {
    response,
  }) {

    const startSegmentGroup = parseInt(parseInt(response.scope.startsegment) * 0.2);
    const endSegmentGroup = parseInt(parseInt(response.scope.endsegment) * 0.2);

    // Vue.log.log(`** API response ${startSegmentGroup} - ${endSegmentGroup}`);
    // Vue.log.log(response.scope);

    for (var group in response.data) {

      const segmentGroup = parseInt(parseInt(group) * 0.2);
      let newMessage = response.data[group];
      newMessage.segmentGroup = segmentGroup;
      Vue.set(state.messages, segmentGroup, newMessage);
    }
  },
  [types.GET_MESSAGES_FAILURE](initialState, {
    response,
  }) {
    // error in response
  },
  [types.SET_ACTIVE_SEGMENT](initialState, activeSegment) {
    state.activeSegment = activeSegment;
    state.activeSegmentVisible = (activeSegment === undefined) ? false : true;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
