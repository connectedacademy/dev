import _ from 'lodash';

export const computedMessages = (state) => {
  let messages = [];
  let i = 0;
  while (i < 10) {
    messages.push({
      username: '@username',
      text: `Test message ${i} #hashtag`,
      position: 0, // + ((i - 5) * 40) + (this.scrollPosition * 100),
    });
    i += 1;
  }

  const minAllowable = (messages.length < 20) ? messages.length : 20;
  messages = messages.slice(messages.length - minAllowable, messages.length);
  return messages;
};

export const scrollPosition = state => _.ceil(state.scrollPosition);
