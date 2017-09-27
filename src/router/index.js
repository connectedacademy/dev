import Vue from 'vue';
import Router from 'vue-router';

const AdminMain = () => import('@/components/admin/AdminMain');

const AuthenticationFlow = () => import('@/components/authentication/AuthenticationFlow');
const Registration = () => import('@/components/authentication/Registration');

// const Course = () => import('@/components/Course');
import Course from '@/components/Course';
const Markdown = () => import('@/components/Markdown');

const Feedback = () => import('@/components/feedback/Feedback');
const FeedbackView = () => import('@/components/feedback/FeedbackView');

const FourCornersOnboarding = () => import('@/components/fourcorners/FourCornersOnboarding');;

const About = () => import('@/components/pages/About');;
const Schedule = () => import('@/components/pages/Schedule');;

Vue.use(Router);

export default new Router({
  // mode: 'history',
  // scrollBehavior: function (to, from, savedPosition) {
  //   return savedPosition || { x: 0, y: 0 }
  // },
  routes: [
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
    },
    {
      name: 'class',
      path: '/course/:classSlug',
      component: Course,
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
      name: 'fourcorners',
      path: '/fourcorners',
      component: FourCornersOnboarding,
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
    {
      name: 'admin',
      path: '/admin',
      component: AdminMain,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
