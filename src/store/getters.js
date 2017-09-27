import store from '@/store';

export const fauxTime = state => state.fauxTime;
export const scrollPosition = state => state.scrollPosition;
export const scrollPoints = state => state.scrollPoints;
export const offsetScrollPosition = state => state.offsetScrollPosition;
export const pendingScrollPosition = state => state.pendingScrollPosition;
export const currentSection = state => state.currentSection;
export const autoPlaying = state => state.autoPlaying;

export const currentTime = (state) => {
  let time = store.getters.currentSectionScrollPosition;
  if (!time) return 0;
  return (time < 0) ? 0 : (time / (158.0 * 0.2));
};

export const pageStyle = (state) => {
  // Return classes
  const activeClasses = {
    authenticating: (state.route.name === 'registration'),
    authenticated: state.auth.isAuthenticated,
  };
  return activeClasses;
};
