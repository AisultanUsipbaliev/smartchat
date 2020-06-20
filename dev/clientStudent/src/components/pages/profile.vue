<template>
	<div class="magical-content">
		<p v-if="!$mq.phone" class="page_title">ПРОФИЛЬ</p>
		<div class="profile-flexim">
			<user-info></user-info>
			<div class="fd">
				<near-lesson v-if="lessons"></near-lesson>
				<home-frame></home-frame v-if="rate != null">
				<div class="donthavelesson" v-if="rate == null">
					<p class="homeFrame-title">Добро пожаловать!</p>
					<div class="links-to-courses">
						<p class="text-welcome-to-the-party">Вам нужно записаться на обучающий курс с преподавателем. 
						Посмотрите список тарифов и подобрать подходящий для себя.
						Вы можете попробовать бесплатный пробный урок.</p>
						<router-link class="buttons-goto-courses" to="/request?id=1">Попробовать бесплатно</router-link>
						<router-link class="buttons-goto-courses" to="/courses">Записаться</router-link>
					</div>
				</div>	
			</div>
			<certificate v-if="certificate"></certificate>
		</div>
	</div>
</template>

<script>
	import userInfo from '@/components/partials/magical/userInfo'	 
	import nearLesson from '@/components/partials/magical/nearLesson'	 
	import homeFrame from '@/components/partials/magical/homeFrame'	 
	import Certificate from '@/components/partials/magical/certificate'
	export default{
		name: 'Profile',
		components: {
			userInfo,
			nearLesson, 
			homeFrame,
			Certificate,
		},
		data(){
			return{
				student: '',
				lessons: [],
				certificate: '',
				rate: '',
				all: [],
				donthave: false
			}
		},
		computed: {
			allInfo() {
		    return this.$store.getters['user/ALL'];
		  },
		},
		watch: {
    	allInfo (newData) {
 			this.student = newData.user;
 			this.lessons = newData.lessons;
 			this.certificate = newData.sertificats;
 			this.rate = newData.rate;
 			this.all = newData;
    	}
  	},
		created(){
			this.student = this.$store.getters['user/ALL'].user;
			this.lessons = this.$store.getters['user/ALL'].lessons;
			this.certificate = this.$store.getters['user/ALL'].sertificats;
			this.rate = this.$store.getters['user/ALL'].rate;
			this.all = this.$store.getters['user/ALL'];
		}
	}
</script>