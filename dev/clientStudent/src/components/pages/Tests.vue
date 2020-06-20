<template>
	<div class="content">
		<!-- web -->
		<p v-if="!$mq.phone" class="page_title">ТЕСТЫ<img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered"></p>
		<div v-if="!$mq.phone" class="tests_block">
			<div class="head_tests">
				<div>Тест</div>
				<div>Статус</div>
				<div>Дата</div>
				<div>Результат</div>
				<div>Действие</div>
			</div>
			<div class="body_tests">
				<h2 v-if="noTests" class="nocontent"><span>Нет тестов</span></h2>
				
				<div class="test_row" v-for="test in tests">
					<div class="test_row_unit">{{test.test_name}}</div>

					<div class="test_row_unit" v-if="test.answers"><span class="green">Выполнено</span></div>
					<div class="test_row_unit" v-else><span class="red">Не выполнено</span></div>

					<div class="test_row_unit">{{dataConverter(test.dt)}}</div>
					<div class="test_row_unit" style="font-size: 18px; font-weight: 600; color: #1e83d4;">{{test.count || test.done ? test.count+'%':'-'}}</div>

					<div class="test_row_unit" v-if="test.answers">
						<router-link :to="'/result?id='+test.test_id"  class="result_show">Просмотр</router-link>
					</div>
					<div class="test_row_unit" v-else>
						<router-link :to="'/test?id='+test.test_id"  class="result_show">Выполнить</router-link>
					</div>
				</div>
			</div>
		</div>		
		<!-- web end -->
		<!-- mobile -->
		<div v-if="$mq.phone" class="block_tests">
			<img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered">
			<h2 v-if="noTests" class="nocontent"><span>У вас нет тестов</span></h2>
			<div class="test_block" v-for="test in tests">
				<p class="test_title">{{test.test_name}}</p>
				<p class="tests_level_title">Уровень: {{test.lvl_name}}</p>
				<p class="date_title">Дата: {{dataConverter(test.dt)}}</p>
				<div class="result_scale" v-if="test.answers">
					<p class="result_title"><img src="/static/img/complete.png" class="complete_right">Ваш результат: {{test.count}}%</p>
					<div class="scale">
						<div class="percent_scale" :style="{width: test.count + '%'}"></div>
					</div>
				</div>
				<div class="result_scale" v-else>
					<p class="result_title color_red">Не выполнено</p>
				</div>
				<router-link v-if="test.answers"" :to="'/result?id='+test.test_id"  class="see_result">Просмотр</router-link>
				<router-link v-else :to="'/test?id='+test.test_id"  class="see_result">Выполнить</router-link>
			</div>
		</div>
		<!-- mobile end -->
	</div>
</template>
<script>
export default {
	name: 'Tests',
	data () {
		return {
			tests: [],
			delivered: false,
			noTests: false
		}
	},
	created(){ 
		this.$http.post('/api', 'method=get-tests')
		.then(res => {
			if(res.data.status == 200) {
				this.tests = res.data.tests 
			} else {
				this.noTests = true
			}
			this.delivered = true
		})
		.catch(err => console.error(err))
	},
	methods:{
		dataConverter(date) {
			date = new Date(date)
			return `${date.getDate()}.${Number(date.getMonth())+1}.${date.getFullYear()}`
		}
	}
}
</script>
<style type="text/css" scoped>
	@import url(../../assets/styles/pages/web/tests.css) (min-width: 768px);
	@import url(../../assets/styles/pages/mobile/tests.css) (max-width: 768px);
</style>