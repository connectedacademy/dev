/* eslint-disable */
import Vue from 'vue';
import * as types from '@/store/mutation-types';

// Faux time

export const setFauxTime = (state, fauxTime) => {
  state.fauxTime = fauxTime;
};

// Scroll position

export const setScrollPosition = (state, scrollPosition) => {

  // Set scroll position
  state.scrollPosition = scrollPosition;

  // Set offset scroll position
  state.offsetScrollPosition = (state.scrollPosition + (window.innerHeight - 200));
};

export const setPendingScrollPosition = (state, scrollPosition) => {

  // Set pending scroll position
  state.pendingScrollPosition = scrollPosition;
};

export const TOGGLE_DEBUG_MODE = (state) => {
  state.debug = !state.debug;
};

export const TOGGLE_TIMETRAVEL_MODE = (state) => {
  state.timetravel = !state.timetravel;
};

export const setAutoPlaying = (state, isAutoPlaying) => {
  state.autoPlaying = isAutoPlaying;
};

// Scroll points
export const setSavedScrollPosition = (state, scrollPosition) => {
  state.savedScrollPosition = scrollPosition;
};
export const resetScrollPoints = (state) => {
  state.scrollPoints = {};
};
export const setScrollPoint = (state, scrollPoint) => {
  Vue.set(state.scrollPoints, scrollPoint.slug, scrollPoint);
};
export const setCurrentSection = (state, scrollPoint) => {
  state.currentSection = scrollPoint;
};