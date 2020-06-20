import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios';
import Student from '@/views/Student'
import StudentDetail from '@/views/StudentDetail'
import Group from '@/views/Group'
import GroupDetail from '@/views/GroupDetail'
import Chart from '@/views/Chart'
import Billing from '@/views/Billing'
import Teacher from '@/views/Teacher'
import TeacherDetail from '@/views/TeacherDetail'
import TeacherMonitoring from '@/views/TeacherMonitoring'
import Method from '@/views/Method'
import Rate from '@/views/Rate'
import RateDetail from '@/views/RateDetail'
import Feedback from '@/views/Feedback'
import Report from '@/views/Report'
import Journal from '@/views/Journal'
import Setting from '@/views/Setting'
import Login from '@/views/Login'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: { name: 'Student' },
      meta: { requiresAuth: true }
    },
    {
      path: '/student',
      name: 'Student',
      component: Student,
      meta: { requiresAuth: true }
    },
    {
      path: '/student/:id',
      name: 'StudentDetail',
      component: StudentDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/group',
      name: 'Group',
      component: Group,
      meta: { requiresAuth: true }
    },
    {
      path: '/group/:id',
      name: 'GroupDetail',
      component: GroupDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/chart',
      name: 'Chart',
      component: Chart,
      meta: { requiresAuth: true }
    },
    {
      path: '/billing',
      name: 'Billing',
      component: Billing,
      meta: { requiresAuth: true }
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: Teacher,
      meta: { requiresAuth: true }
    },
    {
      path: '/teacher/:id',
      name: 'TeacherDetail',
      component: TeacherDetail,
      meta: { requiresAuth: true },

    },
    {
      path: '/monitoring',
      name: 'TeacherMonitoring',
      component: TeacherMonitoring,
      meta: { requiresAuth: true }
    },
    {
      path: '/method',
      name: 'Method',
      component: Method,
      meta: { requiresAuth: true }
    },
    {
      path: '/rate',
      name: 'Rate',
      component: Rate,
      meta: { requiresAuth: true }
    },
    {
      path: '/rate/:id',
      name: 'RateDetail',
      component: RateDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback,
      meta: { requiresAuth: true }
    },
    {
      path: '/report',
      name: 'Report',
      component: Report,
      meta: { requiresAuth: true }
    },
    {
      path: '/journal',
      name: 'Journal',
      component: Journal,
      meta: { requiresAuth: true }
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

if (process.env.NODE_ENV === 'production') {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      axios.post("/check_auth")
      .then(response => {
        if (response.status == 200) next();
        else next({ path: '/login', query: { redirect: to.fullPath } });
      })
      .catch(error => {
        next({ path: '/login', query: { redirect: to.fullPath } }); 
      })
    } else {
      next();
    }
  })
} 

export default router