/* eslint-disable */
import Vue from 'vue';
import _ from 'lodash';
import * as types from '@/store/mutation-types';
import API from '@/api';
import store from '@/store';

// initial state
const state = {
  visualisation: [],
  media: [],
  activeSegment: undefined,
  peekSegment: undefined,
  lastMessage: undefined,
};

// getters
const getters = {
  lastMessage() {
    return state.lastMessage;
  },
  activeSegment() {
    return state.activeSegment;
  },
  peekSegment() {
    return state.peekSegment;
  },
  media() {
    Vue.log.log('Media from state');
    return state.media;
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
  getMedia({
    commit,
  }, request) {
    API.message.getMedia(
      request.slug,
      request.path,
      response => commit(types.GET_MEDIA_SUCCESS, {
        response,
      }),
      response => commit(types.GET_MEDIA_FAILURE, {
        response,
      }),
    );
  },
  pushMessage({
    commit,
  }, request) {
    const currentSegmentGroup = _.multiply(_.floor(_.divide(request.postData.currentSegment, 10)), 10) * 0.2

    let newMessage = {
      message: request.response.body,
      info: {
        total: 1,
      },
      segmentGroup: currentSegmentGroup,
      faux: true,
    };

    newMessage.message.author = newMessage.message.user;

    // Vue.set(state.messages, currentSegmentGroup, newMessage);

    store.commit('updateLastMessage', newMessage);
  },
};

// mutations
const mutations = {
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
  [types.GET_MEDIA_SUCCESS](initialState, {
    response,
  }) {
    state.media = response.response;
  },
  [types.GET_MEDIA_FAILURE](initialState, {
    response,
  }) {
    Vue.log.log('error');
    state.media = [];
    // error in response
  },
  [types.GET_MESSAGES_SUCCESS](initialState, {
    response,
  }) {

    const startSegmentGroup = parseInt(parseInt(response.scope.startsegment) * 0.2);
    const endSegmentGroup = parseInt(parseInt(response.scope.endsegment) * 0.2);

    for (var group in response.data) {

      const segmentGroup = parseInt(parseInt(group) * 0.2);
      let newMessage = response.data[group];
      newMessage.segmentGroup = segmentGroup;

      Vue.set(state.messages, segmentGroup, newMessage);
    }
  },
  [types.SET_ACTIVE_SEGMENT](initialState, activeSegment) {
    state.activeSegment = activeSegment;
  },
  [types.SET_PEEK_SEGMENT](initialState, peekSegment) {
    state.peekSegment = peekSegment;
  },
  updateLastMessage({ commit }, newMessage) {
    state.lastMessage = newMessage;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
