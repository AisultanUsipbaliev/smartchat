<template>
	<div class="certificateBlock" v-if="certificates.length != 0">
		<p class="certificate-title">Сертификаты</p>
		<a download :href="'/common/files/' + sert.filename" class="certificate-row" v-for="(sert, index) in certificates" :key="index" title="Скачать сертификат">
			<img src="/static/img/sert.png" class="sert-png">
			<p>{{sert.rate_name}}</p>
			<fai icon="download"/>
		</a>
	</div>
</template>

<script>
	export default{
		name: 'certificate',
		data(){
			return{
				certificates: []
			}
		},
		created(){
			this.certificates = this.$store.getters['user/ALL'].sertificats;
		},
		computed: {
			allInfo() {
		    	return this.$store.getters['user/ALL'];
		  },
		},
		watch: {
    	allInfo (newData) {
 			this.certificates = newData.sertificats;
    	}
  	}
	}
</script>