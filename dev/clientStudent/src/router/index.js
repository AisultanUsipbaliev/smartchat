import Vue    from 'vue'
import Router from 'vue-router'

import Profile        from '@/components/pages/profile'
import Settings       from '@/components/pages/Settings'
import Faq            from '@/components/pages/Faq'
import Chat           from '@/components/pages/Chat'
import Welcome        from '@/components/pages/Welcome'
import Tutorial       from '@/components/tutorial/index.vue'
import QuizList      from '@/components/pages/QuizList'
import Homework       from '@/components/pages/Homework'
import Courses        from '@/components/pages/Courses'
import Schedule       from '@/components/pages/Schedule'
import Request        from '@/components/pages/Request'
import Tests          from '@/components/pages/Tests'
import Test           from '@/components/pages/Test'
import Feedback       from '@/components/pages/Feedback'
import Result         from '@/components/pages/Result'
import Bauka          from '@/components/pages/Bauka'
import Quiz           from '@/components/pages/Quiz'
import QuizResult     from '@/components/pages/QuizResult'
import Anvar          from '@/components/pages/Anvar'
import video          from '@/components/pages/video'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: { name: 'Profile' }
    },
    // {
    //   path: '/faq',
    //   name: 'Faq',
    //   component: Faq,
    //   meta: {page_count: 6}
    // },
    {
      path: '/video',
      name: 'video',
      component: video,
      meta: {page_count: 6}
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {page_count: 0}
    },
    {
      path: '/request',
      name: 'Request',
      component: Request,
      meta: {page_count: 1},
    },
    {
      path: '/courses',
      name: 'Courses',
      component: Courses,
      meta: {page_count: 1}
    },
    {
      path: '/schedule',
      name: 'Schedule',
      component: Schedule,
      meta: {page_count: 2}
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      meta: {page_count: 3}
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
      meta: {page_count: 3}
    },
    {
      path: '/tests',
      name: 'Tests',
      component: Tests,
      meta: {page_count: 4}
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
      meta: {page_count: 4}
    },
    {
      path: '/result',
      name: 'Result',
      component: Result,
      meta: {page_count: 4}
    },
    {
      path: '/quizlist',
      name: 'QuizList',
      component: QuizList,
      meta: {page_count: 5}
    },
    {
      path: '/homework',
      name: 'Homework',
      component: Homework,
      meta: {page_count: 5}
    },
    {
      path: '/quizresult',
      name: 'QuizResult',
      component: QuizResult,
      meta: {page_count: 5}
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
      meta: {page_count: 6}
    },
    {
      path: '/tutorial',
      name: 'Tutorial',
      component: Tutorial
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {page_count: 0}
    },
    {
      path: '/quiz',
      name: 'Quiz',
      component: Quiz,
      meta: {page_count: 5}
    }
  ]
})

export default router 