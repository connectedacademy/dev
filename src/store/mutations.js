/* eslint-disable */
import Vue from 'vue';
import * as types from '@/store/mutation-types';

export const TOGGLE_DEBUG_MODE = (state) => {
  state.debug = !state.debug;
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