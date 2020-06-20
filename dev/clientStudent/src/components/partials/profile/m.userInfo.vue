<template>
	<div>
	<div class="blocks_profile">
		<div>
			<p class="title">Профиль</p>
			<img :src="student.ava" class="avatar">
			<p class="info_user name">{{student.firstname}} {{student.lastname}}</p>
			<p class="info_user">{{student.lvl_name}}</p>
			<p class="info_user age">{{student.age}}</p>
			<p class="info_user age" v-if="student.lvl_name">{{student.lvl_name}}</p>
			<p class="info_user phone" v-if="student.phone">{{student.phone}}</p>
			<p class="info_user phone" v-if="student.email">{{student.email}}</p>
			<router-link :to="{ name:'Courses' }" class="btn1" tag="p" v-if="!rate">Записаться на занятия</router-link>
			<span class="more_end_courses1">Еще</span>
		</div>
		</div>
		<div class="block" v-if="sertificats.length">
			<div>
				<p class="title">Сертификаты:</p>
				<div class="scroll_downloads">
					<a class="end_course_title" :href="'/common/files/' + item.filename" v-for="item in sertificats" download>
						<p class="downloadType">{{item.rate_name}}</p><fai icon="download"  class="downloadIcon"/>
					</a>
				</div>
			</div>
		</div>
		<slot></slot>
  	</div>
</template> 

<script>
	export default {
	  name: 'mUserInfoProfile',
	  data () {
	    return {
				student: '',
				rate: '',
				sertificats: ''
	    }
	  },
	  created(){
			this.student = this.$store.getters['user/ALL'].user;
			this.rate = this.$store.getters['user/ALL'].rate;
			this.sertificats = this.$store.getters['user/ALL'].sertificats;
	  },
	  computed: {
		  allInfo() {
		    return this.$store.getters['user/ALL'];
		  },
		},
		watch: {
	    allInfo (newData) {
	 			this.student = newData.user;
	    	this.rate = newData.rate;
	 			this.sertificats = newData.sertificats;
	    }
	  },
	}
</script>

<style type="text/css" scoped>
  @import url(../../../assets/styles/pages/web/profile.css) (min-width: 768px);
  @import url(../../../assets/styles/pages/mobile/profile.css) (max-width: 768px);
</style>