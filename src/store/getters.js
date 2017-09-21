import store from '@/store';

export const fauxTime = (state) => {
  return state.fauxTime;
};

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
  let time = store.getters.currentSectionScrollPosition;
  if (!time) return 0;
  return (time < 0) ? 0 : (time / (158.0 * 0.2));
};

export const currentSection = (state) => {
  return state.currentSection;
};

export const autoPlaying = state => state.autoPlaying;
