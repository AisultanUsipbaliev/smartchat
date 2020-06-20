<template>
	<div class="content">
	<!-- web -->	
		<p v-if="!$mq.phone" class="page_title">ТАРИФЫ<img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered"></p>
		<div v-if="!$mq.phone" class="courses">
			<div class="course" v-for="rate in courses">
				<div class="head_course">
					<img :src="rate.image? $fileUrl + rate.image : '/static/img/study-1968077_1920.jpg'" class="course_img">
				</div>
				<div class="body_course">
					<p class="course_name">{{rate.rate_name}}</p>
					<p class="text_course">{{rate.rate_title}}</p>
					<p class="time_course">{{getHoursString(rate.lessons)}}</p>
					<p class="group_type">{{rate.group_type?'Индивидуально':'В группе'}}</p>
					<p class="old_cost" v-if="rate.oldCost">{{rate.oldCost}} тг</p>
					<p class="new_cost">{{rate.rate_cost}} тг</p>
				</div>
				<div class="footer_course" v-if="access">
					<router-link :to="'/request?id='+rate.rate_id"  class="course_request">Записаться</router-link>
				</div>
				<div class="footer_course" v-if="request && rate.mine" @click="askDeleteRequest">
					<a class="course_request">Удалить заявку</a>
				</div>
				<div class="footer_course" v-if="((group || request) && !rate.mine) || (group && rate.mine)">
					<a class="course_request_mine">Вы записаны</a>
				</div>
			</div>
		</div>
	<!-- web end -->
	<!-- mobile -->
	<div v-if="!delivered && $mq.phone" class="wait_block">
		<img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered">
	</div>	
	<div v-if="$mq.phone" class="course" v-for="rate in courses">
		<div class="head_course">
			<img :src="rate.image? $fileUrl + rate.image : '/static/img/study-1968077_1920.jpg'" class="course_img">
		</div>
		<div class="body_course">
			<p class="course_name">{{rate.rate_name}}</p>
			<p class="text_course">{{rate.rate_title}}</p>
			<p class="time_course">{{getHoursString(rate.lessons)}}</p>
			<p class="group_type">{{rate.group_type?'Индивидуально':'В группе'}}</p>
			<p class="old_cost" v-if="rate.oldCost">{{rate.oldCost}} тг</p>
			<p class="new_cost">{{rate.rate_cost}} тг</p>
		</div>
		<div class="footer_course" v-if="access">
			<router-link :to="'/request?id='+rate.rate_id"  class="course_request">Записаться</router-link>
		</div>
		<div class="footer_course" v-if="request && rate.mine" @click="askDeleteRequest">
			<a class="course_request">Удалить заявку</a>
		</div>
		<div class="footer_course" v-if="((group || request) && !rate.mine) || (group && rate.mine)">
			<a class="course_request_mine">Вы записаны</a>
		</div>
	</div>
	<!-- mobile end -->
	</div>
</template>

<script>
export default {
	name: 'Homework',
	data () {
		return {
			courses: [],
			delivered: false,
			access: false,
			request: false,
			group: false
		}
	},
	created(){
		this.$http.post('/api', 'method=get-courses')
		.then(res => {
			this.request 	= res.data.reqs.length > 0
			this.courses 	= res.data.rates
			this.delivered 	= true
			this.group 		= res.data.group > 0
			this.access 	= res.data.reqs.length == 0 && res.data.group == 0
		})
	},
	methods: {
		getHoursString(n){
			if(n == 1) return n + ' час'
			else if(n > 1 && n < 5) return n + ' часа'
			else return n + ' часов'
		},
		askDeleteRequest() {
			this.$swal({
				title: 'Вы уверены, что хотите удалить вашу заявку?',
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Да',
				cancelButtonText: 'Отмена'
			}).then(res => {
				if(res.value) this.deleteRequest()
			})
		},
		deleteRequest() {
			this.$http.post('/api', 'method=delete-req')
			.then(res => {
				if(res.data.status == 200) {
					this.$swal({ type: 'success', title: 'Ваша заявка успешно удалена!' })
					this.access 	= true
					this.request	= false
				}
				else this.$swal({ type: 'error', title: 'Удаление невозможно!' })
			})
			.catch(err => {  console.error(err); this.$swal( { type: 'error',title: 'Удаление невозможно!' } )})
		}
	}
}
</script>
<style type="text/css" scoped>
	@import url(../../assets/styles/pages/web/courses.css) (min-width: 768px);
	@import url(../../assets/styles/pages/mobile/courses.css) (max-width: 768px);
</style>