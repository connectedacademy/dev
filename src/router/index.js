import Vue from 'vue'
import Router from 'vue-router'

import Auth from '@/mixins/Auth'
import API from '@/api'
import store from '@/store'

const Profile = () => import('@/components/profile/Profile')
const Survey = () => import('@/components/survey/Survey')

const Registration = () => import('@/components/authentication/Registration')

const Class = () => import('@/components/Class')
const Markdown = () => import('@/components/Markdown')

const Feedback = () => import('@/components/feedback/Feedback')
const FeedbackView = () => import('@/components/feedback/FeedbackView')

const FourCornersOnboarding = () => import('@/components/fourcorners/FourCornersOnboarding')

const Home = () => import('@/components/pages/Home')
const About = () => import('@/components/pages/About')
const Faq = () => import('@/components/pages/Faq')
const Schedule = () => import('@/components/pages/Schedule')
const Terms = () => import('@/components/pages/Terms')

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {
      name: 'schedule',
      path: '/schedule',
      component: Schedule,
    },
    {
      name: 'class',
      path: '/class/:classSlug/:contentSlug?/:segmentId?',
      component: Class,
    },
    {
      name: 'course',
      path: '/course/:classSlug/:contentSlug?/:segmentId?',
      component: Class,
    },
    {
      name: 'registration',
      path: '/registration',
      component: Registration,
      meta: { ensureNotRegistered: true }
    },
    {
      name: 'feedback',
      path: '/feedback/browse/:classSlug/:contentSlug',
      component: Feedback,
      meta: { ensureRegistered: true }
    },
    {
      name: 'feedback_view',
      path: '/feedback/browse/:classSlug/:contentSlug/:id',
      component: Feedback,
      meta: { ensureRegistered: true }
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
      name: 'about',
      path: '/about',
      component: About,
    },
    {
      name: 'faq',
      path: '/faq',
      component: Faq,
    },
    {
      name: 'profile',
      path: '/profile',
      component: Profile,
      meta: { ensureRegistered: true }
    },
    {
      name: 'survey',
      path: '/survey',
      component: Survey,
      meta: { ensureRegistered: true }
    },
    {
      name: 'githubauth',
      path: '/auth/github',
      redirect: (to) => {
        window.location = 'https://api.connectedacademy.io/v1/admin/login'
      }
    },
    {
      name: 'home',
      path: '/',
      component: Home
    },
    {
      name: 'terms',
      path: '/terms',
      component: Terms,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {

  // Ensure authenticated
  if (to.matched.some(record => record.meta.ensureAuthenticated)) {
    if (typeof store.state.auth.user === 'undefined') {
      next({ name: 'schedule', query: { flash: { msg: 'You are not authenticated', type: 'warn' } } })
    }
  }

  // Ensure registered
  if (to.matched.some(record => record.meta.ensureRegistered)) {
    if (!(store.state.auth.user && store.state.auth.user.registration)) {
      next({ name: 'schedule', query: { flash: { msg: 'You are not registered', type: 'warn' } } })
    }
  }

  // Ensure not registered
  if (to.matched.some(record => record.meta.ensureNotRegistered)) {

    API.auth.checkAuth(
      response => (response) => {
        
        if (!response.data.data.user || response.data.data.user && response.data.data.user.registration) {
          next({ name: 'schedule', query: { flash: { msg: 'You are already registered', type: 'warn' } } })
        }
        next()
      },
      response => (response) => {
        if (!response.data.data.user || response.data.data.user && response.data.data.user.registration) {
          next({ name: 'schedule', query: { flash: { msg: 'You are already registered', type: 'warn' } } })
        }
        next()
      }
    )
  }
  next()
})

export default router