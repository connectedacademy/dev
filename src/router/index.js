import Vue from 'vue';
import Router from 'vue-router';

import AdminMain from '@/components/admin/AdminMain';

import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';
import Registration from '@/components/authentication/Registration';

import Course from '@/components/Course';
import Markdown from '@/components/Markdown';

import Feedback from '@/components/feedback/Feedback';
import FeedbackView from '@/components/feedback/FeedbackView';

import FourCornersOnboarding from '@/components/fourcorners/FourCornersOnboarding';

import About from '@/components/pages/About';
import Schedule from '@/components/pages/Schedule';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  scrollBehavior: function (to, from, savedPosition) {
    console.log('one');
    return savedPosition || { x: 0, y: 0 }
  },
  routes: [
    // {
    //   name: 'authenticated',
    //   path: '/authenticated',
    //   redirect: '/registration',
    // },
    {
      name: 'course-redirect',
      path: '/course/:classSlug/:contentSlug/:segmentId',
      redirect: (to) => {
        const { hash, params, query } = to;
        if ((params.classSlug === 'undefined') || (params.contentSlug === 'undefined') || (params.segmentId === 'undefined')) {
          return { path: '/' };
        }
        return { path: '/', query: { class: params.classSlug, content: params.contentSlug, segment: params.segmentId } };
      },
    },
    {
      name: 'course',
      path: '/',
      component: Course,
      meta: { scrollToTop: false },
    },
    {
      name: 'class',
      path: '/course/:classSlug',
      component: Course,
      meta: { scrollToTop: false },
    },
    {
      name: 'registration',
      path: '/registration',
      component: Registration,
      meta: { scrollToTop: true },
    },
    {
      name: 'feedback',
      path: '/feedback/browse/:classSlug/:contentSlug',
      component: Feedback,
      meta: { scrollToTop: true },
    },
    {
      name: 'view_feedback',
      path: '/feedback/:id',
      component: FeedbackView,
      meta: { scrollToTop: true },
    },
    {
      name: 'fourcorners',
      path: '/fourcorners',
      component: FourCornersOnboarding,
      meta: { scrollToTop: true },
    },
    {
      name: 'markdown',
      path: '/markdown/:url',
      component: Markdown,
      meta: { scrollToTop: true },
    },
    {
      name: 'schedule',
      path: '/schedule',
      component: Schedule,
      meta: { scrollToTop: true },
    },
    {
      name: 'about',
      path: '/about',
      component: About,
      meta: { scrollToTop: true },
    },
    {
      name: 'admin',
      path: '/admin',
      component: AdminMain,
      meta: { scrollToTop: true },
    },
    {
      path: '*',
      redirect: '/',
      meta: { scrollToTop: true },
    },
  ],
});
