<template>
	<div class="content">
	<!-- web -->
		<p v-if="!$mq.phone" class="page_title">ЗАДАНИЯ <img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered"></p>
		<div v-if="!$mq.phone" class="homeworks_blocks">
			<div class="head_homework">
				<div>Название</div>
				<div>Статус</div>
				<div>Дата</div>
				<div>Оценка</div>
				<div>Действия</div>
			</div>
			<div class ="body_homework">
				<h2 v-if="noDz" class="nocontent"><span>Нет заданий</span></h2>
				<div v-for="quiz in quizList" class="homework_row">
					<div class="homework_row_unit">{{quiz.name}}</div>
					<div class="homework_row_unit"><span :class="[quiz.content ? 'green':'red' ]">{{quiz.content? 'Выполнено': 'Не выполнено'}}</span></div>
					<div class="homework_row_unit">{{dataConverter(quiz.dt)}}</div>
					<div class="homework_row_unit"><p class="bals" >{{quiz.score ? Math.floor((quiz.score * 10)) + '%': '-'}}</p></div>
					<div class="homework_row_unit"><router-link :to="quiz.content ? '/quizresult?id=' + quiz.id : '/quiz?id='+quiz.id"  class="result_show">{{quiz.content?'Просмотр':'Выполнить'}}</router-link></div>
				</div>
			</div>
		</div>
	<!-- web end -->
	<!-- mobile -->
		<div v-if="$mq.phone" class="blocks_homeworks">
			<img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered">
			<h2 v-if="noDz" class="nocontent"><span>У вас нет заданий</span></h2>
			<div v-for="quiz in quizList" class="home_block">
				<p class="home_title">{{quiz.name}}</p>
				<p class="homework_level_title">Уровень: {{quiz.lvl_name}}</p>
				<p class="date_title">Дата: {{dataConverter(quiz.dt)}}</p>
				<div class="result_scale" v-if="quiz.score">
					<p class="result_title"><img src="/static/img/complete.png" class="complete_right">Ваш результат: 
						<img src="/static/img/star.png" alt="" class="star" v-for="n in quiz.score">
					</p>
				</div>
				<div class="result_scale" v-if="!quiz.content">
					<p class="result_title red" style="color: red">Не выполнено</p>
				</div>
				<router-link :to="quiz.content ? '/quizresult?id=' + quiz.id : '/quiz?id='+quiz.id" class="see_result">{{quiz.content?'Просмотреть':'Выполнить'}}</router-link>
			</div>
		</div>
	<!-- mobile end -->
	</div>
</template>

<script>
export default {
	name: 'QuizList',
	data () {
		return {
			quizList: [],
			homeworks: [],
			delivered: false,
			noDz: false
		}
	},
	created(){
		this.$http.post('/api', 'method=GET-QUIZ-LIST')
		.then(res => {
			this.delivered = true
			if(res.data.status != 200) {
				this.noDz = true
				return
			}
			this.quizList = res.data.quizList 
		})
		.catch(err => {
			console.error(err)
		})
	},
	methods: {
		dataConverter(date) {
			date = new Date(date)
			return `${date.getDate()}.${Number(date.getMonth())+1}.${date.getFullYear()}`
		}
	},
}
</script>
<style type="text/css" scoped="">
	@import url(../../assets/styles/pages/web/homeworks.css) (min-width: 768px);
	@import url(../../assets/styles/pages/mobile/homeworks.css) (max-width: 768px);
</style>