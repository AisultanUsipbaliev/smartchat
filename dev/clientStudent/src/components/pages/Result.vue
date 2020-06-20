<template>
	<div class="content">
		<!-- web -->
		<p v-if="!$mq.phone" class="page_title">ТЕСТЫ</p>
		<div v-if="!$mq.phone" class="res_result_block">
			<div class="res_all_tests">
				<div class="res_all_tests_head">
					<p class="res_all_tests_title">Пройденные:</p>
				</div>
				<div class="res_all_tests_body">
					<p :class="{'res_test_name':true, 'current':testId == test.test_id}" v-for="test in tests" v-if="test.answers" @click="showResult(test.test_id, $event)">
						{{test.test_name}}
					</p>
				</div>
			</div>
			<div class="res_test_content" v-if = "result.result_id > 0">
				<div class="res_test_name_head">
					<p class="res_answer_name">{{test.test_name}}</p>
				</div>
				<div class="res_test_result">
					<span class="res_result_text">Вы выполнили данный тест: {{dataConverter(result.dt)}}</span>
					<span class="res_blue_result">Ваша оценка: {{result.count}}%</span>
				</div>
				<div class="res_test_check_body">
					<div class="res_answer_block" v-for='(quest,i) in computed'>
						<p class="res_question"><span>{{i + 1 + ') '}}</span>{{ quest.question}}</p>
						<div v-for="(variant, n) in quest.variants" 
							:class="['res_question_row', quest.success?
							quest.answered == getLetter(n)? 'res_right_answer':'': 
							quest.correct == getLetter(n)? 'res_wt_answer':
							quest.answered == getLetter(n)?'res_wrong_answer':'']" >
							<label>{{variant}}</label>
						</div>
					</div>
				</div>
				<div class="res_footer_check_test">
					<router-link class="res_answer_send" :to="{name: 'Chat'}" >Перейти в чат</router-link>
				</div>
			</div>
		</div>
		<!-- web.end -->
		<!-- mobile -->
		<div v-if="$mq.phone" class="res_test_content">
			<div class="res_test_name_head">
				<p class="res_answer_name">{{test}}</p>
				<div class="res_test_result">
					<span class="res_result_text">Вы выполнили данный тест: {{dataConverter(result.dt)}}</span>
					<span class="res_blue_result">Ваша оценка: {{result.count}}%</span>
				</div>
			</div>
			<div class="res_test_check_body">
				<div class="res_answer_block" v-for='(quest,i) in computed'>
					<p class="res_question"><span class="res_question_number">{{i + 1}}</span>{{quest.question}}</p>
					<div v-for="(variant, n) in quest.variants"  
						:class="['res_question_row', quest.success?
							quest.answered == getLetter(n)? 'res_right_answer':'': 
							quest.correct == getLetter(n)? 'res_wt_answer':
							quest.answered == getLetter(n)?'res_wrong_answer':'']" >
						<label class="res_p70">{{variant}}</label>
					</div>
				</div>
			</div>
			<div class="res_footer_check_test">
				<router-link class="res_answer_send" :to="{name: 'Chat'}" >Перейти в чат</router-link>
			</div>
		</div>
		<!-- mobile.end -->
	</div>
</template>
<script>
export default {
	name: 'Result',
	data () {
		return {
			testId: 0,
			tests: [],
			result: {
				result_id: 0,
				answers: [],
				count: 0,
				dt: ''
			},
			test: {
				test_id: 0,
				test_name: '',
				dt: ''
			},
			computed: []
		}
	},
	created(){
		this.testId = this.$router.history.current.query.id
		this.$http.post('/api', 'method=get-tests')
		.then(res => {
			this.tests = res.data.tests
		})
		.catch(err => {
			console.error(err)
		})

		this.$http.post('/api', `method=GET-RESULT&&test_id=${this.testId}`)
		.then(res => {
			if(res.data.status == 200) {
				this.computed 	= res.data.computed
				for(let i=0; i<this.computed.length; i++) 
					this.computed[i].variants = JSON.parse(this.computed[i].variants)
				this.result 	= res.data.result
				this.test 		= res.data.test
			}
		})
		.catch(err => {
			console.error(err)
		})
	},
	methods:{
		dataConverter(date) {
			date = new Date(date)
			let minutes = date.getMinutes()
			minutes = minutes < 10? '0'+minutes: minutes
			let hours = date.getHours()
			hours = hours < 10? '0'+hours: hours
			let month = Number(date.getMonth())+1
			month = month < 10? '0'+month: month
			return `${hours}:${minutes}:${date.getSeconds()},  ${date.getDate()}.${month}.${date.getFullYear()}`
		},
		getLetter(n) {
			switch(n) {
				case 0: 	return 'a'
				case 1: 	return 'b'
				case 2: 	return 'c'
				case 3: 	return 'd'
				case 4: 	return 'e'
				case 5: 	return 'f'
				case 6: 	return 'g'
				case 7: 	return 'h'
				case 8: 	return 'i'
				case 9: 	return 'j'
				case 10: 	return 'k'
				case 11: 	return 'l'
				case 12: 	return 'm'
			}
		},
		showResult(testId, e) {
			this.$http.post('/api', `method=GET-RESULT&&test_id=${testId}`)
			.then(res => {
				let elements = document.getElementsByClassName('res_test_name')
				for(let i=0; i<elements.length; i++) elements[i].classList.remove('current')
				e.target.classList.add('current')
				if(res.data.status == 200) {
					this.computed 			= res.data.computed
					this.result 			= res.data.result
					this.test 				= res.data.test
					for(let i=0; i<this.computed.length; i++) 
						this.computed[i].variants = JSON.parse(this.computed[i].variants)
				}
			})
			.catch(err => {
				console.error(err)
			})
		}
	}
}
</script>
<style type="text/css" scoped>
	@import url(../../assets/styles/pages/web/result.css) (min-width: 768px);
	@import url(../../assets/styles/pages/mobile/result.css) (max-width: 768px);
</style>