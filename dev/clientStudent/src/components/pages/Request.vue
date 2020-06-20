<template>
	<div :class="{'content':true, 'content_block': layout == 1}">
	<!-- web -->  
		<!-- first layout -->
		<div class="request_blocks" v-if="!$mq.phone && layout == 1">
			<div class="head_choose">
				<p class="choose_course">Курс "Пробное занятие"</p>
				<p class="warning_course">Укажите удобное для вас время для прохождения занятия:</p>
			</div>
			<div class="body_choose">
				<div class="day_row" v-for="i in 7"> 
					<div class="w-20">
						<span class="week_day">{{days[i-1]}}</span>
					</div>
					<div class="w-80">
						<selector :day="i-1" v-if="counts[i-1]>0" :start="8" :finish="21"></selector>
						<selector :day="i-1" v-if="counts[i-1]>1" :start="8" :finish="21"></selector>
						<img v-if="counts[i-1]<3" src="/static/img/tab_plus.png" class="plus_button" @click="upCount(i-1)">
					</div>
				</div>
			</div>
			<div class="foot_choose" @click="sendIntervals()">
				<a class="ready" >Готово</a>	
			</div>
		</div>
		<!-- first layout end -->
		<!-- second layout -->
		<p class="page_title" v-if="!$mq.phone && layout == 2">ПРЕПОДАВАТЕЛЬ</p>
		<div class="teachers_blocks" v-if="!$mq.phone && layout == 2">
			<p class="teacher_choose">Выберите преподавателя:</p>
			<div class="choose_body">
				<!-- <div class="recommend">
					<span class="bb">Рекомендованный преподаватель:</span>
				</div> -->
				<div class="others">
					<div class="other">
						<!-- <span class="bb">Другие преподователи:</span> -->
						<div class="rec_div" v-for = "teacher in teachers">
							<p class="teacher_name">{{teacher.login}} {{teacher.lastname}}</p>
							<div class="stars" >
								<img src="/static/img/star.png" class="star" alt="" v-for="star in Math.floor(teacher.rating)">
								<img src="/static/img/halfstar.png" class="star" alt="" v-if='teacher.rating*10%10>5'>
							</div>
							<div class="choose_button">
								<button class="choose" @click="chooseTeacher(teacher.teacher_id)">Выбрать</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- second layout end -->
	<!-- web end -->
	<!-- mobile -->
		<!-- first layout -->
		<div class="blocks_teacher_choose" v-if="$mq.phone && layout == 1">
			<p class="course_name">Пробное занятие</p>
			<p class="time_title">Укажите удобное для вас время для проведения занятий:</p>
			<div class="body_time" v-for="i in 7">
				<div class="day_row">
					<div>
						<span class="week_day">{{days[i-1]}}</span>
					</div>
					<div class="select_row">
						<selector :day="i-1" v-if="counts[i-1]>0" :start="8" :finish="21"></selector>
						<selector :day="i-1" v-if="counts[i-1]>1" :start="8" :finish="21"></selector>
					</div>
					<img v-if="counts[i-1]<1" src="/static/img/tab_plus.png" class="plus_button" @click="upCount(i-1)">
				</div>
			</div>
			<div class="footer_time" @click="sendIntervals()">	
				<a class="complete">Готово</a>
			</div>
		</div>
		<!-- first layout end -->
		<!-- second layout -->
		<div class="blocks_teacher_choose" v-if="$mq.phone && layout == 2">
			<p class="teacher_choose">Выберите преподавателя:</p>
			<div class="choose_body">
			<!-- 	<div class="recommend">
					<span class="bb">Рекомендованный преподователь:</span>
				</div> -->
				<div class="others">
					<div class="other">
						<!-- <span class="bb">Другие преподователи:</span> -->
						<div class="rec_div" v-for = "teacher in teachers">
							<p class="teacher_name">{{teacher.login}} {{teacher.lastname}}</p>
							<div class="stars" >
								<img src="/static/img/star.png" class="star" alt="">
								<span class="rate_percent">{{Math.round(parseFloat(teacher.rating) * 10) / 10}}</span>
							</div>
							<div class="choose_button">
								<button class="choose" @click="chooseTeacher(teacher.teacher_id)">Выбрать</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- second layout end -->
	<!-- mobile end -->
	</div>
</template>

<script>
import selector from '@/components/partials/request/selector' 

export default {
	name: 'Request',
	components: {
		selector
	},
	data () {
		return {
			layout: 1,
			counts: [1,1,1,1,1,1,1],
			days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
			rate: {},
			minDays: 3,
			intervals: [],
			teachers: [],
			teacher: 0,
			invoiceId: ''
		}
	},
	created(){
		let rate_id = this.$router.history.current.query.id
		this.$http.post('/api', `method=get-courses&&rate_id=${rate_id}`)
		.then(res => {
			let access = res.data.reqs.length == 0 && res.data.group == 0
			if(!access) this.$router.push('/courses')
			this.rate = res.data.rate
			if(res.data.rate.lessons > 10) this.minDays = res.data.rate.lessons / 4 * 3
		})
		.catch(err => {
			this.$router.push('/courses')
			console.error(err);
		})
		this.makeID()
	},
	methods: {
		upCount(i) {
			this.counts.splice(i, 1, this.counts[i]+1)
		},
		sendIntervals(){
			let result = this.validateIntervals()
			if(!result.ok) return
			this.intervals = result.mas
			if(this.intervals.length < this.minDays) {
				this.$swal({
					type: 'error',
					title: 'Недостаточно промежутков выбрано!',
					text: `Для этого тарифа вам необходимо выбрать минимум ${this.minDays/3}.`
				})
				return
			}
			this.$http.post('/api', `method=get-teachers&&rate=${this.rate.rate_id}&&request=` 
				+ this.$toServer(this.intervals))
			.then(res => {
				if(res.data.status == 202) {
					this.$swal({
						type: 'error',
						title: 'К сожалению в это время никто не может вести уроки!',
						text: `Попробуйте другое время или свяжитесь с администрацией для уточнения времени занятий.`
					})
				} else if(res.data.status == 200) { 
					this.layout = 2
					this.teachers = res.data.teachers
				} else console.log(res.data)
			})
			.catch(err => {
				this.$router.push('/courses')
				console.error(err)
			})
		},
		validateIntervals() {
			let mas = []
			let days = document.getElementsByClassName('day_row')
			for(let i=0; i<days.length; i++) days[i].style.background = 'white'
			let selects = document.getElementsByClassName('noborder')
			let ok = true
			for(let i=0; i<selects.length; i+=2) {
				let first = selects[i]
				let second = selects[i+1]
				if(second.value == 'нет' && first.value == 'нет') continue
				else if(second.value == 'нет' || first.value == 'нет') {
					first.parentNode.parentNode.parentNode.style.background = 'linen'
					ok = false
				} else {
					mas.push(first.value, second.value, first.getAttribute('day')) 
				}
			}
			return {ok, mas}
		},
		chooseTeacher(teacher) {
			this.teacher = teacher
			if(this.rate.rate_cost == 0) this.sendRequest()
			else this.openPayment()
		},
		openPayment() {
			var widget = new cp.CloudPayments()
			widget.charge({ // options
				publicId: 		'pk_eaff98b9708d86599925646c1e73c',  //id из личного кабинета
				description: 	this.rate.rate_name, //назначение
				amount: 		this.rate.rate_cost, //сумма
				currency: 		'KZT', //валюта
				invoiceId: 		this.invoiceId, //номер заказа  (необязательно)
			},
			(options)=> { // success
				sendRequest()
			},
			(reason, options) => { 
				console.log(reason)
				console.log(options)
			})
		},
		sendRequest() {
			this.$swal({
				title: 'Отправляем запрос...',
				onBeforeOpen: () => {
					this.$swal.showLoading()
					this.$http.post('/api', `method=SEND-REQ&&rate=${this.rate.rate_id}&&teacher=${this.teacher}&&request=${this.$toServer(this.intervals)}`)
					.then(res => {
						this.$swal.hideLoading()
						if(res.data.status == 200) {
							this.$swal({
								type: 'success',
								title: 'Ваша заявка успешно записана!',
								text: `Совсем скоро преподаватель ответит на нее.`
							})
							this.$socket.send(JSON.stringify({notice: 2, teacher_id: this.teacher}))
							this.$store.dispatch('user/GET_ALL');
							this.$router.push('/courses')
						}
					})
					.catch(err=>{ 
						this.$swal.hideLoading()
						console.error(err);
						this.$swal({
							type: 'error',
							title: 'При записи вашей заявки произошла ошибка',
							text: `Свяжитесь с администрацией.`
						}) 
					})
				}
			})
		},
		makeID() {
			this.invoiceId = this.$makeId(10)
			this.$http.post('/api', `method=CHECK-PAYMENT&&invoiceId=${this.invoiceId}`)
			.then(res => {
				if(!res.data.isOk) this.makeID()
			})
			.catch(err => { console.error(err); })
		},
		async getQuick() {
			let date
			let access
			await this.$http.post('/api', 'method=QUICKLY-TIME')
			.then(res => {
				date 	= new Date(res.data.date)
				access 	= res.data.access
			}).catch(err => console.error(err))
			let now = new Date()
			let difference = date.valueOf() - now.valueOf()
			difference = difference / 60000
			if(access)
				this.$swal({
					title: `Подайте срочную заявку!`,
					text: `Ваше занятие начнется через ${Math.round(difference)} мин. Вы хотите подать срочную заявку?`,
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Да',
					cancelButtonText: 'Нет'
				}).then(res => {
					if(res.value)
						this.$http.post('/api', 'method=QUICKLY')
						.then(response => {
							if(response.data.status == 200) {
								this.$swal({
									type: 'success',
									title: 'Ваша заявка успешно записана!',
									text: `Совсем скоро преподаватель ответит на нее.`
								})
								this.$router.push('/courses')
							} else {
								this.$swal({
									type: 'error',
									title: 'Выберите время вручную	',
									text: `К сожалению, сегодня мы уже не принимаем срочные заявки.`
								}) 
							}
						})
						.catch(err => {alert(err)}) 
				})
		},
		dataConverter(date) {
			let year 	= date.getFullYear()
			let month 	= date.getMonth() + 1
			let day 	= date.getDate()
			let hours 	= date.getHours()
			let minutes = date.getMinutes()
			return `${hours}:${minutes<10?'0'+minutes: minutes} ${day}.${month<10?'0'+month: month}.${year}`
		},
	}
}
</script>
<!-- <script src="https://widget.cloudpayments.kz/bundles/cloudpayments"></script> -->

<style type="text/css">
	@import url(../../assets/styles/pages/web/request.css) (min-width: 768px);
	@import url(../../assets/styles/pages/mobile/request.css) (max-width: 768px);
</style>