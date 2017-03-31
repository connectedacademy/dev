import Vue from 'vue';
import Router from 'vue-router';

import Main from '@/components/Main';

import Course from '@/components/pages/Course';
import About from '@/components/pages/About';
import Schedule from '@/components/pages/Schedule';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
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
