export const setScrollPosition = ({ commit }, scrollPosition) => {
  commit('setScrollPosition', scrollPosition);
};

export const resetState = ({ commit }) => {
  console.log('Reseting state...');
  commit('resetScrollPoints');
  commit('setScrollPosition', 0);
};

export default setScrollPosition;
