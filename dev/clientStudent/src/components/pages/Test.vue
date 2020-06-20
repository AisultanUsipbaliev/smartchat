<template>
	<div class="content">
		<p v-if="!$mq.phone" class="page_title">ТЕСТЫ</p>
		<div v-if="!$mq.phone" class="test_block">
			<div class="all_tests">
				<div class="all_tests_head">
					<p class="all_tests_title">Тесты</p>
				</div>
				<div class="all_tests_body">
					<p :class="{'test_name_active' : item.test_id == test_id}" v-for="(item, index) in test_list">
						<router-link :to="'/test?id='+item.test_id" tag="p" class="test_name">{{index+1}}. {{item.test_name}}</router-link>
					</p>
				</div>
			</div>
			<div v-if="test" class="test_content">
				<div class="test_name_head">
					<p class="answer_name">{{test.test_name}}</p>
				</div>
				<form id="form" v-on:submit="onSubmit" class="test_check_body">
					<div v-for="(item, index) in questions" class="answer_block">
						<p class="question">{{index+1}}) {{item.quest_title}}</p>
						<div :style="{backgroundColor: item.color}">
							<div v-for="(variant, i) in item.variants" class="question_row" >
								<label :for="'question_'+index+'_'+i" class="contain">{{variant}}
									<input type="radio" class="inputV" :name="'question_'+index" :id="'question_'+index+'_'+i" :value="getLetter(i)" v-model="item.correct">
									<span class="checkmark"></span>
								</label>
							</div>
						</div>
					</div>
				</form>
				<div class="footer_check_test">
					<button class="answer_send" type="submit" form="form">Сдать ответы</button>
				</div>
			</div>
		</div>
		<div v-if="$mq.phone && test" class="test_content">
			<div class="test_name_head">
				<p class="answer_name">{{test.test_name}}</p>
			</div>
			<form id="form" v-on:submit="onSubmit" class="test_check_body">
				<div v-for="(item, index) in questions" class="answer_block">
					<span class="question_number question_number_margin">Вопрос {{index+1}}</span>
					<p class="question question_margin">{{item.quest_title}}</p>
					<div :style="{backgroundColor: item.color}">
						<div v-for="(variant, i) in item.variants" class="question_row" >
							<input type="radio" :name="'question_'+index" :id="'question_'+index+'_'+i" :value="getLetter(i)" v-model="item.correct">
							<label :for="'question_'+index+'_'+i" class="p100">{{variant}}</label>
						</div>
					</div>
				</div>
			</form>
			<div class="footer_check_test">
				<button class="answer_send" type="submit" form="form">Сдать ответы</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
    	test_id: '',
      test: {},
      questions: {},
      test_list: [],
      router_flag: false
    }
  },
  created() {
  	this.test_id = this.$route.query.id;
  	this.getTestById();
  	if (!this.$mq.phone) {
  		this.getTestList();
  	} 
  }, 
  methods: {
  	getLetter(n) {
      switch(n) {
        case 0:   return 'a'
        case 1:   return 'b'
        case 2:   return 'c'
        case 3:   return 'd'
        case 4:   return 'e'
        case 5:   return 'f'
        case 6:   return 'g'
        case 7:   return 'h'
        case 8:   return 'i'
        case 9:   return 'j'
        case 10:   return 'k'
        case 11:   return 'l'
        case 12:   return 'm'
      }
    },
  	getTestById() {
  		this.test = {};
  		this.questions = {};
	  	this.$http.post('/api', `method=GET-TEST&&test_id=${this.test_id}`)
			.then(res => {
				if (res.data.status == 200) {
					for (var i = 0; i < res.data.questions.length; i++) {
						res.data.questions[i].variants = JSON.parse(res.data.questions[i].variants)
						res.data.questions[i].correct = '';
						res.data.questions[i].color = 'white';
					}
					this.test = res.data.test;
					this.questions = res.data.questions;
				} else { throw new Error(res.status) }
	  	})
	  	.catch(err => {
	  		if (err.response.status == 404) {
	  			this.$router.replace({ path: 'result', query: { id: this.test_id } })
	  		}
	  		this.test = false;
	  	});
  	},
  	getTestList() {
	  	this.$http.post('/api', `method=GET-TESTS`)
			.then(res => {
				if (res.data.status == 200) {
					for (var i = 0; i < res.data.tests.length; i++) {
						if (!res.data.tests[i].answers) {
							this.test_list.push(res.data.tests[i]);
						} 
					}
				} else { throw new Error(res.status) }
	  	})
	  	.catch(err => {
	  		console.error(err);
	  	});
  	},
  	onSubmit(event) {
  		event.preventDefault()
  		let flag = true;
  		for (var i = 0; i < this.questions.length; i++) {
  			if (this.questions[i].correct == '') {
  				let question = this.questions[i];
  				question.color = 'linen';
  				this.questions.splice(i, 1, question);
  				flag = false;
  			} else {
  				let question = this.questions[i];
  				question.color = 'white';
  				this.questions.splice(i, 1, question);
  			}
			} 
			if (flag) {
	  		let result = JSON.stringify(this.questions)
	  		this.$http.post('/api', `method=CHECK-RESULT&&test_id=${this.test_id}&&result=${result}`)
				.then(res => {
					if (res.data.status == 200) {
						this.$swal({
							type: 'success',
							title: 'Тест успешно отправлен',
								onClose: () => {
								this.router_flag = true;
								this.$router.push({ path: 'result', query: { id: `${this.test_id}` } })
						  }
						})
						this.$socket.send(JSON.stringify({notice: 4, test_id: this.test_id}))
						if (!this.$mq.phone) {
							for (var i = 0; i < this.test_list.length; i++) {
								if (this.test_list[i].test_id == this.test_id) {
									this.test_list.splice(i, 1);
								}
							}
						}
					} else { throw new Error(res.status) }
		  	})
		  	.catch(err => {
	  			this.$swal({
						type: 'error',
						title: `Ошибка, тест не отправлен!`
					})
	  			console.error(err)
		  	});
			} else {
				this.$swal({
					type: 'warning',
					title: 'Ответьте на все вопросы!'
				})
			}
  	}
  },
  beforeRouteLeave (to, from, next) {
  	if (this.router_flag) {
  		next();
  	} else {
	  	if (this.test_id && this.questions.length) {
	  		let flag = false;
	  		for (var i = 0; i < this.questions.length; i++) {
	  			if (this.questions[i].correct != '') {
	  				flag = true;
	  				break;
	  			} 
				} 
	  		if (flag) {
			  	this.$swal({
			  	  title: 'Вы уверены что хотите уйти?',
			  	  text: "Ваши ответы не будут сохранены",
			  	  type: 'warning',
			  	  showCancelButton: true,
			  	  confirmButtonColor: '#3085d6',
			  	  cancelButtonColor: '#3085d6',
			  	  confirmButtonText: 'Да',
			  	  cancelButtonText: 'Нет',
			  	  reverseButtons: true
			  	}).then((result) => {
			  	  if (result.value) {
			  	    next();
			  	  } else {
					    next(false)
					  }
			  	});
	  		} else { next() }
	  	} else { next() }
  	}
	},
	beforeRouteUpdate (to, from, next) {
		if (this.test_id && this.questions.length) {
  		let flag = false;
  		for (var i = 0; i < this.questions.length; i++) {
  			if (this.questions[i].correct != '') {
  				flag = true;
  				break;
  			} 
			} 
  		if (flag) {
		  	this.$swal({
		  	  title: 'У вас есть несохранённые изменения!',
		  	  text: "Ваши ответы не будут сохранены",
		  	  type: 'warning',
		  	  showCancelButton: true,
		  	  confirmButtonColor: '#3085d6',
		  	  cancelButtonColor: '#3085d6',
		  	  confirmButtonText: 'Ок',
		  	  cancelButtonText: 'Отмена',
		  	  reverseButtons: true
		  	}).then((result) => {
		  	  if (result.value) {
		  	    next();
		  	    this.test_id = this.$route.query.id;
    				this.getTestById();
		  	  } else {
				    next(false)
				  }
		  	});
  		} else { 
  			next();
  		  this.test_id = this.$route.query.id;
    		this.getTestById();
     	}
  	} else { 
  		next();
  	  this.test_id = this.$route.query.id;
    	this.getTestById();
    }
	}
}
</script>

<style type="text/css" scoped>
  @import url(../../assets/styles/pages/web/test.css) (min-width: 768px);
  @import url(../../assets/styles/pages/mobile/test.css) (max-width: 768px);
</style>