<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
		<loading v-if="loading"></loading>
		<div class="addtest">
			<div class="head-addtest">
				<div class="first-half-addtest">
					<input type="text" autocomplete="false" class="addtestname" placeholder="Название теста" :style="test.test_name_err ? {borderColor: 'red'} : ''" @focus="test.test_name_err = false" v-model="test.test_name">
					<select class="level-choose-testadd" v-model="test.lvl_id" :style="test.lvl_id_err ? {borderBottom: '1px solid red'} : ''" @focus="test.lvl_id_err = false" >
						<option v-for="level in levels" :value="level.lvl_id">{{level.lvl_name}}</option>
					</select>
				</div>
				<div class="second-half-addtest">
					<span class="all-check" @click="saveTest()">Готово</span>
					<!-- <router-link to="/tests"><span class="delete-addtest">Отменить</span></router-link> -->
				</div>
			</div>
			<div class="body-addtest">
				<div class="addtest-row" v-for="(question, key) in questions" :key="key" :style="question.variants_err || question.correct_err ? {border: '1px solid red'} : ''">
					<div class="numberanddeleterow">
						<span class="test-row-number">{{key + 1}}</span>
						<img src="/static/img/blue_x.png" class="delete-test-row" @click="deleteQuestion(key)" title="Удалить">
					</div>
					<div class="body-addtest-row">
						<div class="question-parametr">
							<input type="text" autocomplete="false" class="addtest-question addTestInput" placeholder="Напишите вопрос" v-model="question.quest_title"
										 :style="question.quest_title_err ? {borderColor: 'red'} : ''" @focus="question.quest_title_err = false">
							<input type="number" autocomplete="false" class="weight-question addTestInput" placeholder="Вес" v-model="question.weight"
										 :style="question.weight_err ? {borderColor: 'red'} : ''" @focus="question.weight_err = false">
						</div>
						<div class="labels-addtest-row">
							<div class="options">
								<div class="option-question" v-for="(answer, anskey) in question.variants" :key="anskey">
									<input type="radio" @click="question.correct_err = false, question.correct = $functions.getLetter(anskey + 1)" :checked="anskey + 1 == $functions.getNumber(question.correct) ? true : false" :name="key">
									<span class="option-name">{{$functions.getLetter(anskey + 1)}}</span>
									<input type="text" autocomplete="false" placeholder="Вариант ответа" class="option-text addTestInput" v-model="answer.content" 
												 :style="answer.content_err ? {borderColor: 'red'} : ''" @focus="answer.content_err = false">
									<img src="/static/img/cancel.png" title="Удалить вариант" class="delete-option-question" @click="deleteAnswer(key, anskey)">
								</div>
							</div>
							<div class="option-actions">
								<fai icon="plus" title="Добавить вариант ответа" @click="addAnswer(key)"/>	
							</div>
						</div>
					</div>
				</div>
				<div class="plus-add-test" @click="addQuestion()">
					<fai icon="plus" class="plus-add-second" title="Добавить вопрос" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default{
		name: 'addTest',
		data(){
			return{
				msg: 'addTest',
				test: {},
				questions: [],
				levels: [],
				loading: false,
			}
		},
		mounted(){
			this.getLevels();
			let id = Number(this.$route.params.id)
			if(Number.isInteger(id)) this.getTest(id)
			else{
				for (var i = 0; i < 2; i++) this.questions.push({variants: [{content: ''},{content: ''}], weight: 1})
					Vue.set(this.test, 'lvl_id', 1);
			}
		},
		beforeRouteLeave (to, from, next){
			if(this.loading) next(true)
			else{ 
				let joke = confirm('Вы хотите покинуть страницу? Не сохраненные данные будут удалены!')
				if(!joke)next(false)
				else next(true)
			}
		},
		methods:{
			saveTest(){
			if(!this.questions.length) return;
				let id = Number(this.$route.params.id)
				if(this.checkTest()){
					this.loading = true;
					if(Number.isInteger(id))
						this.$http.post('/api', `method=UPDATE-TEST&test_id=${this.test.test_id}&name=${this.test.test_name}&lvl=${this.test.lvl_id}&questions=${JSON.stringify(this.questions)}`)
						.then( res => {
							if(res.status === 200)
								this.$router.replace({ path: '/tests' });
							else console.warn(res)
						})
						.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'UPDATE-TEST'}))
					else
						this.$http.post('/api', `method=ADD-TEST&name=${this.test.test_name}&lvl=${this.test.lvl_id}&questions=${JSON.stringify(this.questions)}`)
						.then( res => {
							if(res.status === 200) this.$router.replace({ path: '/tests' })
							else console.warn(res)
						})
						.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'ADD-TEST'}))
				}
			},
			checkTest(){
				if(this.$functions.validateInput(this.test, 'test_name')) return false;
				if(this.$functions.validateInput(this.test, 'lvl_id')) return false;
				let err = false;
				for(let i = 0; i < this.questions.length; i++){
					if(this.$functions.validateInput(this.questions[i], 'quest_title')) return false;
					if(this.$functions.validateInput(this.questions[i], 'weight')) return false;
					if(this.$functions.validateInput(this.questions[i], 'correct')) return false;
					if(this.$functions.validateInput(this.questions[i], 'variants', 2)) return false;
					for(let j = 0; j < this.questions[i].variants.length; j++){
						this.$functions.validateInput(this.questions[i].variants[j], 'content')
						if(this.questions[i].variants[j].content_err == true && err == false){
							err = true;
							break;
						}
					}
					if(err) break;
				}
				if(err) return false;
				else    return true;
			},
			getTest(id){
				this.loading = true;
				this.$http.post('/api', `method=GET-TEST&test_id=${id}`)
				.then( res => {
					this.test = res.data.test;
					this.questions = this.test.questions;
					for(let i = 0; i < this.questions.length; i++){
						this.questions[i].variants = JSON.parse(this.questions[i].variants);
						for(let j = 0; j < this.questions[i].variants.length; j++)
							this.questions[i].variants[j] = {'content': this.questions[i].variants[j]}
					}
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-TEST'}) )
				.finally( () => this.loading = false )
			},
			getLevels(){
				this.$http.post('/api', `method=GET-LEVELS`)
				.then( res => this.levels = res.data.levels )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-LEVELS'}) )
			},
			addQuestion(){
				this.questions.push({variants: [{content: ''},{content: ''}], weight: 1});
			},
			deleteQuestion(index){
				this.questions.splice(index, 1);
			},
			addAnswer(index){
				this.questions[index].variants.push({content: ''})
				this.$functions.validateInput(this.questions[index], 'variants', 2);
			},
			deleteAnswer(index, variant){
				this.questions[index].variants.splice(variant, 1);
				if(this.questions[index].correct > this.questions[index].variants.length)
					this.questions[index].correct = '';
				this.$functions.validateInput(this.questions[index], 'variants', 2);
			},
		}
	}
</script>
<style>
	@import url(../../assets/css/tests.css); 
</style>














