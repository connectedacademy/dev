import app from '@/config';
import store from '@/store';

export const scrollPosition = state => state.scrollPosition;
export const scrollPoints = state => state.scrollPoints;
export const currentSection = state => state.currentSection;

export const pageStyle = (state) => {
  // Return classes
  const activeClasses = {
    authenticating: (state.route.name === 'registration'),
    authenticated: state.auth.isAuthenticated,
  };
  return activeClasses;
};
