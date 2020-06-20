<template>
	<div v-bind:class="{'info_profile':rate, 'info_profile1' : !rate && sertificats, 'info_profile2':!rate&&!sertificats}">
		<div v-bind:class="{'about_user':rate, 'about_user1' : !rate && sertificats, 'about_user2':!rate&&!sertificats}">
			<p class="level_title">Студент</p>
			<div v-bind:class="{'about_user_block':rate, 'about_user_block1' : !rate && sertificats, 'about_user_block2':!rate&&!sertificats}">
				<div>
					<img :src="student.ava" class="profile_avatar">
					<p class="profile_name">{{student.firstname}} {{student.lastname}}</p>
					<p class="number" v-if="student.email">{{student.email}}</p>
					<p class="age">{{student.age}}</p>
					<p class="age" v-if="student.lvl_name">{{student.lvl_name}}</p>
					<p class="number" v-if="student.phone">{{student.phone}}</p>
					<router-link :to="{ name:'Courses' }" class="sign_up" tag="button" v-if="!rate">Записаться на занятия</router-link>
				</div>
				<div v-if="sertificats.length">
					<div class="scroll_downloads">
						<p class="end_courses">Сертификаты:</p>
						<a class="end_course_title" :href="'/common/files/' + item.filename" v-for="item in sertificats" download>
							<p class="downloadType">{{item.rate_name}}</p><fai icon="download"  class="downloadIcon"/>
						</a>
					</div>
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