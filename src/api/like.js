import Vue from 'vue';
import * as config from '@/api/config';

export default {
  likeContent(request, cb, errorCb) {
    Vue.http.post(`${config.API}/course/like/${request.class}/${request.content}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
  unlikeContent(request, cb, errorCb) {
    Vue.http.post(`${config.API}/course/unlike/${request.class}/${request.content}`).then((response) => {
      cb(response.body);
    }, (response) => {
      errorCb(response);
    });
  },
};
