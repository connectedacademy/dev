import Vue from 'vue'
import Router from 'vue-router'

import API from '@/api'
import store from '@/store'

const Profile = () => import('@/components/profile/Profile')
const Survey = () => import('@/components/survey/Survey')

const Registration = () => import('@/components/authentication/Registration')

const Class = () => import('@/components/class/Class')
const Content = () => import('@/components/class/Content')
const Markdown = () => import('@/components/markdown/Markdown')
const Live = () => import('@/components/live/Live')

const Feedback = () => import('@/components/feedback/Feedback')

const FourCornersOnboarding = () => import('@/components/fourcorners/FourCornersOnboarding')

const Home = () => import('@/components/pages/Home')
const Schedule = () => import('@/components/pages/Schedule')
const Page = () => import('@/components/pages/Page')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      name: 'schedule',
      path: '/schedule',
      component: Schedule,
      meta: {
        editable: {
          type: 'schedule'
        }
      }
    },
    {
      path: '/class/:classSlug',
      component: Class,
      children: [
        {
          name: 'content',
          path: '',
          component: Content,
          meta: {
            editable: {
              type: 'content'
            }
          }
        },
        {
          name: 'markdown',
          path: 'content/:url*',
          component: Markdown,
          meta: {
            editable: {
              type: 'page',
              path: undefined
            }
          }
        },
        {
          name: 'live',
          path: 'live/:segmentId?',
          component: Live,
          meta: {
            editable: {
              type: 'live'
            }
          }
        }
      ]
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
      meta: {
        pageStyle: { type: 'registration', visible: false },
        ensureNotRegistered: true
      }
    },
    {
      name: 'feedback',
      path: '/feedback/browse/:classSlug/:contentSlug',
      component: Feedback,
      meta: {
        pageStyle: { type: 'homework', minimized: true },
        // ensureRegistered: true
      }
    },
    {
      name: 'feedback_view',
      path: '/feedback/browse/:classSlug/:contentSlug/:id',
      component: Feedback,
      // meta: { ensureRegistered: true }
    },
    {
      name: 'fourcorners',
      path: '/fourcorners',
      component: FourCornersOnboarding,
      meta: {
        pageStyle: { type: 'fourcorners' }
      }
    },
    {
      name: 'profile',
      path: '/profile',
      component: Profile,
      meta: {
        pageStyle: { type: 'profile' },
        ensureRegistered: true
      }
    },
    {
      name: 'survey',
      path: '/survey',
      component: Survey,
      meta: {
        pageStyle: { type: 'survey', minimized: true },
        ensureRegistered: true
      }
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
      component: Home,
      meta: {
        title: 'Welcome',
        subtitle: '',
        editable: { type: 'page', path: 'content/welcome.md' }
      }
    },
    {
      name: 'cookies',
      path: '/cookies',
      component: Page,
      meta: {
        title: 'Cookies Policy',
        subtitle: 'How we use cookies on the site',
        path: 'content/cookies.md'
      }
    },
    {
      name: 'faq',
      path: '/faq',
      component: Page,
      meta: {
        title: 'FAQ',
        subtitle: 'Frequently asked questions about the site.',
        path: 'content/faq.md',
        editable: { type: 'page' }
      }
    },
    {
      name: 'research',
      path: '/research',
      component: Page,
      meta: {
        title: 'Research Policy',
        subtitle: 'How we collect and use your data in research',
        path: 'content/research.md'
      }
    },
    {
      name: 'privacy',
      path: '/privacy',
      component: Page,
      meta: {
        title: 'Privacy Policy',
        subtitle: 'How we handle your privacy and personal data',
        path: 'content/privacy.md'
      }
    },
    {
      name: 'terms',
      path: '/terms',
      component: Page,
      meta: {
        title: 'Terms of Use',
        subtitle: 'The terms of use when using this website',
        path: 'content/terms.md'
      }
    },
    {
      name: 'about',
      path: '/about',
      component: Page,
      meta: {
        title: 'About',
        subtitle: 'Learn about Connected Academy',
        path: 'content/about.md',
        editable: { type: 'page' }
      }
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {

  // Reset editable content
  store.dispatch('dismissDrawers')
  store.dispatch('dismissOverlay')

  // Ensure registered
  if (to.matched.some(record => record.meta.ensureRegistered)) {
    if (!(store.state.auth.user && store.state.auth.user)) {
      next({ name: 'schedule', query: { flash: 'You are not registered' } })
    } else {
      next()
    }
  }

  // Ensure not registered
  else if (to.matched.some(record => record.meta.ensureNotRegistered)) {
    API.auth.checkAuth(
      response => {
        if (response.user && response.user.registration) {
          // Registered
          console.log('Registered!');
          next({ name: 'schedule', query: { flash: 'You are already registered' } })
        } else {
          // Not registered
          console.log('Not registered!');
          next()
        }
      },
      response => {
        next({ name: 'registration', query: { flash: 'Please register' } })
      }
    )
  }
  else {
    next()
  }
})

export default router