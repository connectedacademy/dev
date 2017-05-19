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
  // Set current section
  if (state.scrollPoints.length === 0) { return undefined; }

  const offsetScrollPosition = state.offsetScrollPosition;

  for (const key in state.scrollPoints ) {
    const scrollPoint = state.scrollPoints[key];
    if ((offsetScrollPosition > scrollPoint.top) && (offsetScrollPosition < scrollPoint.bottom)) {
      if (scrollPoint.content_type === 'class') {
        return scrollPoint;
      }
    }
  };
};

export const autoPlaying = state => state.autoPlaying;

export const canAutoScroll = state => state.canAutoScroll;
