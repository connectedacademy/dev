/* eslint-disable */
import * as types from './mutation-types';

export const setScrollPosition = (state, scrollPosition) => {
  state.scrollPosition = scrollPosition;
};

export const setAutoPlaying = (state, isAutoPlaying) => {
  state.autoPlaying = !isAutoPlaying;
};


export const TOGGLE_DEBUG_MODE = (state) => {
  state.debug = !state.debug;
};
