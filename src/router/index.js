import Vue from 'vue';
import Router from 'vue-router';

import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';

import Main from '@/components/Main';

import Course from '@/components/pages/Course';
import About from '@/components/pages/About';
import Schedule from '@/components/pages/Schedule';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/auth/twitter_callback',
      name: 'AuthenticationFlow',
      component: AuthenticationFlow,
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/course',
      name: 'Course',
      component: Course,
    },
    {
      path: '/schedule',
      name: 'Schedule',
      component: Schedule,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
  ],
});
