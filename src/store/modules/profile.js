import Vue from 'vue';
import _get from 'lodash/get';

// initial state
const state = {
  profileClass: undefined,
  profileAction: undefined,
};

// getters
const getters = {
  profileClass() {
    return state.profileClass;
  },
  profileClassSlug() {
    return _get(state.profileClass, 'slug');
  },
  profileAction() {
    return state.profileAction;
  },
};

// actions
const actions = {
};

// mutations
const mutations = {
  ['updateProfileClass'](initialState, newClass) {
    state.profileClass = newClass;
  },
  ['updateProfileAction'](initialState, newAction) {
    state.profileAction = (state.profileAction === newAction) ? undefined : newAction;
  },
  ['DISMISS_PROFILE_ACTION'](initialState) {
    state.profileAction = undefined;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
