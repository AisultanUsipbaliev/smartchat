import Vue from 'vue'
import Router from 'vue-router'

import Profile from '@/components/pages/profile.vue'
import Schedule from '@/components/pages/schedule.vue'
import Students from '@/components/pages/students.vue'
import Groups from '@/components/pages/groups.vue'
import Chat from '@/components/pages/chat.vue'
import Methodics from '@/components/pages/methodics.vue'
import Homeworks from '@/components/pages/homeworks.vue'
import Tests from '@/components/pages/tests.vue'
import Results from '@/components/pages/results.vue'
import Billing from '@/components/pages/billing.vue'
import AddTest from '@/components/pages/addtest.vue'
import AddHomework from '@/components/pages/addhm.vue'
import TestResult from '@/components/pages/testresult.vue'
import HomeworkResults from '@/components/pages/hmresults.vue'
import HomeResult from '@/components/pages/homeresult.vue'
import NewQuiz from '@/components/pages/newquiz.vue'
Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Home',
			redirect: { name: 'Profile' }
		},
		{
			path: '/profile',
			name: 'Profile',
			component: Profile
		},
		{
			path: '/schedule',
			name: 'Schedule',
			component: Schedule
		},
		{
			path: '/students',
			name: 'Students',
			component: Students
		},
		{
			path: '/groups',
			name: 'Groups',
			component: Groups
		},
		{
			path: '/methodics',
			name: 'Methodics',
			component: Methodics
		},
		{
			path: '/homeworks',
			name: 'Homeworks',
			component: Homeworks
		},
		{
			path: '/tests',
			name: 'Tests',
			component: Tests
		},
		{
			path: '/results',
			name: 'Results',
			component: Results
		},
		{
			path: '/chat',
			name: 'Chat',
			component: Chat
		},
		{
			path: '/tests/:id',
			name: 'AddTest',
			component: AddTest
		},
		{
			path: '/testresult/:id',
			name: 'TestResult',
			component: TestResult
		},
		{
			path: '/homeworks/:id',
			name: 'AddHomework',
			component: AddHomework
		},
		{
			path: '/quiz',
			name: 'NewQuiz',
			component: NewQuiz
		},
		{
			path: '/homeresult',
			name: 'HomeworkResults',
			component: HomeworkResults
		},
		{
			path: '/homeresult/:id',
			name: 'HomeResult',
			component: HomeResult
		},
		{
			path: '/billing',
			name: 'Billing',
			component: Billing
		}
	]
})
