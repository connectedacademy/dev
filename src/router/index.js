import Vue from 'vue';
import Router from 'vue-router';

import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';

import Main from '@/components/Main';
import MarkdownRenderer from '@/components/MarkdownRenderer';

import Course from '@/components/pages/Course';
import About from '@/components/pages/About';
import Schedule from '@/components/pages/Schedule';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/dashboard',
      redirect: '/',
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
    },
    {
      path: '/markdown/:url',
      redirect: (to) => {
        const { hash, params, query } = to;
        return { path: '/markdown', query: { url: params.url } };
      },
    },
    {
      path: '/markdown',
      component: MarkdownRenderer,
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
