import Vue from 'vue';
import Router from 'vue-router';

import AuthenticationFlow from '@/components/authentication/AuthenticationFlow';
import Registration from '@/components/authentication/Registration';

import Main from '@/components/Main';
import Markdown from '@/components/Markdown';

import Feedback from '@/components/feedback/Feedback';
import FeedbackView from '@/components/feedback/FeedbackView';

import About from '@/components/pages/About';
import Schedule from '@/components/pages/Schedule';

Vue.use(Router);

export default new Router({
  // mode: 'history',
  routes: [
    {
      name: 'authenticated',
      path: '/authenticated',
      redirect: '/registration',
    },
    {
      name: 'course',
      path: '/course/:classSlug/:contentSlug/:segmentId',
      redirect: (to) => {
        const { hash, params, query } = to;
        return { path: '/', query: { class: params.classSlug, content: params.contentSlug, segment: params.segmentId } };
      },
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
      name: 'feedback',
      path: '/feedback/browse/:classSlug/:contentSlug',
      component: Feedback,
    },
    {
      name: 'view_feedback',
      path: '/feedback/:id',
      component: FeedbackView,
    },
    {
      name: 'markdown',
      path: '/markdown/:url',
      component: Markdown,
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
