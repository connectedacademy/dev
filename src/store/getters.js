import _ from 'lodash';
import globalState from './index';

export const pageStyle = (state) => {
  // Return classes
  const activeClasses = {
    authenticating: (state.route.name === 'registration'),
    authenticated: state.auth.isAuthenticated,
  };
  return activeClasses;
};

export const scrollPosition = (state) => {
  return state.scrollPosition;
};

export const scrollPoints = (state) => {
  return state.scrollPoints;
};

export const offsetScrollPosition = (state) => {
  return state.offsetScrollPosition;
};

export const currentTime = (state) => {
  if (!globalState.getters.currentSectionScrollPosition) {
    return 0;
  }
  let time = globalState.getters.currentSectionScrollPosition / (158.0 * 0.2); // _.ceil()
  return (time < 0) ? 0 : time;
};

export const currentSection = (state) => {
  return state.currentSection;
};

export const autoPlaying = state => state.autoPlaying;

export const canAutoScroll = state => state.canAutoScroll;
