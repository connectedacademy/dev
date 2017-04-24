import _ from 'lodash';

export const computedMessages = (state) => {
  let messages = [];
  let i = 0;
  while (i < 10) {
    messages.push({
      username: '@username',
      text: `Test message ${i} #hashtag`,
      position: 0,
    });
    i += 1;
  }

  const minAllowable = (messages.length < 20) ? messages.length : 20;
  messages = messages.slice(messages.length - minAllowable, messages.length);
  return messages;
};

export const pageStyle = (state) => {
  // Return classes
  const activeClasses = {
    authenticating: (state.route.name === 'registration'),
    authenticated: state.auth.isAuthenticated,
  };
  return activeClasses;
};

export const scrollPosition = state => _.ceil(state.scrollPosition);

export const currentTime = (state) => {
  let time = state.scrollPosition / 100;
  time = (time < 0) ? 0 : time;
  return _.ceil(time);
};
