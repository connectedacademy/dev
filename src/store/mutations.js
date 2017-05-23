/* eslint-disable */
import Vue from 'vue';
import * as types from './mutation-types';

export const setScrollPosition = (state, scrollPosition) => {

  // Set scroll position
  state.scrollPosition = scrollPosition;

  // Set offset scroll position
  let offset = window.innerHeight;
  offset -= 140;
  state.offsetScrollPosition = (state.scrollPosition + offset);
};

export const TOGGLE_DEBUG_MODE = (state) => {
  state.debug = !state.debug;
};

export const TOGGLE_VIDEO = (state) => {
  state.videoEnabled = !state.videoEnabled;
};

export const setAutoPlaying = (state, isAutoPlaying) => {
  state.autoPlaying = isAutoPlaying;
};

export const setCanAutoScroll = (state, canAutoScroll) => {
  state.canAutoScroll = canAutoScroll;
};

// Scroll points
export const resetScrollPoints = (state) => {
  state.scrollPoints = {};
};
export const setScrollPoint = (state, scrollPoint) => {
  Vue.set(state.scrollPoints, scrollPoint.slug, scrollPoint);
};
export const setCurrentSection = (state, scrollPoint) => {
  state.currentSection = scrollPoint;
};
