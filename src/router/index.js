import Vue from 'vue';
import Router from 'vue-router';

const Profile = () => import('@/components/profile/Profile');
const Survey = () => import('@/components/survey/Survey');

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
  routes: [
    {
      name: 'segment',
      path: '/course/:classSlug/:contentSlug/:segmentId',
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
      name: 'feedback_view',
      path: '/feedback/browse/:classSlug/:contentSlug/:id',
      component: Feedback,
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
      name: 'profile',
      path: '/profile',
      component: Profile,
    },
    {
      name: 'survey',
      path: '/survey',
      component: Survey,
    },
    {
      name: 'githubauth',
      path: '/auth/github',
      redirect: (to) => {
        window.location = 'https://api.connectedacademy.io/v1/admin/login';
      }
    },
    {
      name: 'course',
      path: '/',
      component: Course,
      redirect: (to) => {
        const { hash, params, query } = to;
        return { path: `/course/intro` };
      }
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
