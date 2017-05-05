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
  const offset = 0.0;
  return (state.scrollPosition + offset);
};

export const currentTime = (state) => {
  if (!globalState.getters.currentSectionScrollPosition) {
    return 0;
  }
  let time = globalState.getters.currentSectionScrollPosition / (158.0 * 0.2);
  time = (time < 0) ? 0 : time;
  return _.round(time, 2);
};

export const autoPlaying = state => state.autoPlaying;
