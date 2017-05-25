import * as types from '@/store/mutation-types';
import API from '@/api';

// initial state
const state = {
  current_class: undefined,
  current_lang: 'en',
  course: {},
  hubs: {},
};

// getters
const getters = {
  course() {
    return state.course;
  },
  hubs() {
    return state.hubs;
  },
  currentClass() {
    return state.current_class;
  },
  courseContent() {
    if (state.current_class === undefined) { return undefined; }
    return _.filter(state.current_class.content, item => {
      // Exclude titles from course content
      return !_.includes(['title'], item.content_type);
    });
  },
};

// actions
const actions = {
  getCourse({
    commit,
  }) {
    API.course.getSchedule(
      API.course,
      response => commit(types.GET_SCHEDULE_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SCHEDULE_FAILURE, {
        response,
      }),
    );
  },
  getSpec({
    commit,
  }, classSlug) {
    state.current_class = {
      slug: classSlug,
      loading: true,
    };
    API.course.getSpec(
      classSlug,
      response => commit(types.GET_SPEC_SUCCESS, {
        response,
      }),
      response => commit(types.GET_SPEC_FAILURE, {
        response,
      }),
    );
  },
  getHubs({
    commit,
  }) {
    API.course.getHubs(
      API.course,
      response => commit(types.GET_HUBS_SUCCESS, {
        response,
      }),
      response => commit(types.GET_HUBS_FAILURE, {
        response,
      }),
    );
  },
};

// mutations
const mutations = {
  [types.GET_SCHEDULE_SUCCESS](initialState, {
    response,
  }) {
    state.course = response;
  },
  [types.GET_SCHEDULE_FAILURE](initialState, {
    response,
  }) {
    state.course = {};
    // error in response
  },
  [types.GET_SPEC_SUCCESS](initialState, {
    response,
  }) {
    state.current_class = response;
  },
  [types.GET_SPEC_FAILURE](initialState, {
    response,
  }) {
    state.current_class = {};
    // error in response
  },
  [types.GET_HUBS_SUCCESS](initialState, {
    response,
  }) {
    state.hubs = response;
  },
  [types.GET_HUBS_FAILURE](initialState, {
    response,
  }) {
    state.hubs = {};
    // error in response
  },
  [types.SET_CURRENT_CLASS](initialState, currentClass) {
    state.current_class = currentClass;
  },
  [types.SET_COURSE_LANG](initialState, currentLang) {
    state.current_lang = currentLang;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
