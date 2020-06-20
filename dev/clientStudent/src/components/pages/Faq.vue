<template>
	<div class="content">
		<p class="page_title" v-if="!$mq.phone">FAQ</p>
		<div class="faq_blocks">
			<div :class="[faq.id == id?'faq_open':'faq_close']" :id="'faq'+index" v-for="(faq, index) in faqs">
				<p class="answer_faq" @click="updateState(index)" >{{faq.question}}</p>
				<div class="close_faq" id="close_faq" @click="updateState(index)">
					<img :id="'img'+index" :src="[faq.id == id?'/static/img/x.png':'/static/img/if_down_1167972.png']" class="open_close">
				</div>
				<div class="body_faq">
					<p class="faq_text">{{faq.answer}}</p>
				</div>
				<div class="answer_right" v-if="!faq.mark">
					<p>Ответ был полезным для вас?</p>
					<button class="faq_btn" @click="sendAnswer(index, 1)">Да</button>
					<button class="faq_btn" @click="sendAnswer(index, 0)">Нет</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Faq',
	data () {
		return {
			faqs: [],
			id: 0
		}
	},
	created(){
		this.id = this.$router.history.current.query.id
		this.$http.post('/api', `method=GET-FAQ`)
		.then(res => {
			if (res.status == 200) this.faqs = res.data.faq
		})
		.catch(err => {console.error(err);})
	},
	methods:{
		updateState(i) {
			let el = document.getElementById('faq'+i)
			let img = document.getElementById('img'+i)
			if(el.classList.contains('faq_open')) {
				el.classList.remove('faq_open')
				el.classList.add('faq_close')
				img.src = '/static/img/if_down_1167972.png'
			} else {
				el.classList.remove('faq_close')
				el.classList.add('faq_open')
				img.src = '/static/img/x.png'
			}
		},
		sendAnswer(i, val) {
			this.$http.post('/api', `method=SET-FAQ&&id=${this.faqs[i].id}&&value=${val}`)
			.then(res => {
				if(res.data.status == 200) {
					this.faqs[i].mark = 1
					this.$swal({
						type: 'success',
						title: 'Спасибо за ваш отзыв!'
					})
				} else {
					this.$swal({
						type: 'error',
						title: 'К сожалению, мы не можем принять ваш ответ.'
					})
				}
			})
		}
	}
}
</script>
<style type="text/css" scoped>
	@import url(../../assets/styles/pages/web/faq.css) (min-width: 768px);
	@import url(../../assets/styles/pages/mobile/faq.css) (max-width: 768px);
</style>