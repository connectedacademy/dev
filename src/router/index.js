import Vue from 'vue';
import Router from 'vue-router';

import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';
import Registration from '@/components/authentication/Registration';

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
      name: 'authenticated',
      path: '/authenticated',
      redirect: '/registration',
    },
    {
      name: 'main',
      path: '/',
      component: Main,
    },
    {
      name: 'registration',
      path: '/registration',
      component: Registration,
    },
    {
      name: 'markdown',
      path: '/markdown/:url',
      redirect: (to) => {
        const { hash, params, query } = to;
        return { path: '/markdown', query: { url: params.url } };
      },
    },
    {
      name: 'markdown',
      path: '/markdown',
      component: MarkdownRenderer,
    },
    {
      name: 'course',
      path: '/course',
      component: Course,
    },
    {
      name: 'schedule',
      path: '/schedule',
      component: Schedule,
    },
    {
      name: 'about',
      path: '/about',
      component: About,
    },
  ],
});
