import globalState from './index';

export const setScrollPosition = ({ commit }, scrollPosition) => {

  console.log('Setting scroll position from action');

  // Set current section
  let currentSection = undefined;

  if (globalState.state.scrollPoints.length !== 0) {
    const offsetScrollPosition = globalState.state.offsetScrollPosition;

    for (const key in globalState.state.scrollPoints ) {
      const scrollPoint = globalState.state.scrollPoints[key];
      if ((offsetScrollPosition > scrollPoint.top) && (offsetScrollPosition < scrollPoint.bottom)) {
        if (scrollPoint.content_type === 'class') {
          currentSection = scrollPoint;
          continue;
        }
      }
    };
  }

  commit('setCurrentSection', currentSection);
  commit('setScrollPosition', scrollPosition);
};

export const resetState = ({ commit }) => {
  console.log('Reseting globalState.state...');
  commit('resetScrollPoints');
  commit('setScrollPosition', 0);
};

export default setScrollPosition;
