<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
		<loading v-if="loader"></loading>
		<div class="result-test">
			<div class="head-info-result-test">
				<div class="test-name">
					<router-link to="/results"><fai icon="chevron-left" /></router-link>
					<span class="test-name">{{test.test_name}}</span>
				</div>
				<div class="name-checked-student">{{questions.firstname}} {{questions.lastname}}</div>
			</div>
			<div class="result-block">
				<span class="test-result-percent">Оценка: <b>{{questions.count}}%</b></span>
				<div class="test-checked-date">{{$functions.getNormalDate(questions.dt)}}</div>
			</div>
			<div class="test-result-body">
				<div class="question-check-row" v-for="(question, i) in questions.answers" :key="i">
					<span class="question-check-row-number">{{i+1}}</span>
					<p class="question-check-row-text">{{question.quest_title}}</p>
					<div class="checked-options">
						<p :class="test.question[i].correct == $functions.getLetter(j+1) ? question.correct == $functions.getLetter(j+1) ? 'wright-option'
																																																														 :'right-option' 
																																						 : question.correct == $functions.getLetter(j+1) ? 'wrong-option' 
																																						 																								 : ''"
							 class="check-option" v-for="(variant, j) in question.variants" :key="j">
							<span>{{$functions.getLetter(j+1)}}) {{variant}}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'TestResult',
		data(){
			return{
				test: {},
				questions: [],
				loader: false,
			}
		},
		mounted(){
			this.getTest();
		},
		methods:{
			getTest(){
				this.loader = true;
				this.$http.post('/api',`method=GET-RESULT&result_id=${this.$route.params.id}`)
				.then( async res => {
					await this.$store.dispatch('notice/SET_UNREAD_TEST_RESULT')
					this.test = res.data.test;
					this.questions = res.data.result;
					this.questions.answers = JSON.parse(this.questions.answers)
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-RESULT'}))
				.finally( () => this.loader = false);
			},
		}
	}
</script>

<style>
	@import url(../../assets/css/tests.css); 
</style>