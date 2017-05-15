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

export const offsetScrollPosition = (state) => {
  if (!document.getElementById('col-main')) { return state.scrollPosition; }
  let offset = (document.getElementById('col-main')) ? document.getElementById('col-main').offsetHeight : 0;
  offset -= 140; // action-panel height
  // const val = (document.getElementById('col-main').offsetHeight / 2.0) + 100;
  // if (state.scrollPosition < val) {
  //   offset -= val;
  // }
  return (state.scrollPosition + offset);
};

export const currentTime = (state) => {
  if (!globalState.getters.currentSectionScrollPosition) {
    return 0;
  }
  let time = globalState.getters.currentSectionScrollPosition / (158.0 * 0.2); // _.ceil()
  return (time < 0) ? 0 : time;
};

export const autoPlaying = state => state.autoPlaying;
