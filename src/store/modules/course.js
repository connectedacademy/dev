import * as types from '@/store/mutation-types';
import API from '@/api';
import store from '@/store';
import Moment from 'moment';

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
    const fauxTime = store.state.fauxTime.replace('+', encodeURIComponent('+'));
    API.course.getSchedule(
      fauxTime,
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
    const fauxTime = store.getters.fauxTime.replace('+', encodeURIComponent('+'));
    state.current_class = {
      slug: classSlug,
      loading: true,
    };
    API.course.getSpec(
      fauxTime,
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
    // Get start of first class
    const classStart = response.classes[0].release_at;
    console.log('response.classes[0]');
    console.log(response.classes[0]);

    if (classStart) {
      // Set faux time
      const fauxTime = Moment(classStart).add(1, 'minute').format();
      store.commit('setFauxTime', fauxTime);
    }

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
