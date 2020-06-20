<template>
	<div class="content">
		<!-- web -->
		<p v-if="!$mq.phone" class="page_title">ОБРАТНАЯ СВЯЗЬ</p>
		<div v-if="!$mq.phone" class="feedback_blocks">
			<div class="feed" v-viewer="{movable: true, toolbar: false}">
				<div class="feed_body">
					<p class="about_feed">Возникли трудности в работе с системой?<br> Нашли ошибку или хотите оставить отзыв?<br> Сообщите нам и отправьте скриншот.</p>
					<div class="div_for_img">
					<textarea v-model="text" class="non_scroll text_feed" placeholder="Опишите вашу проблему"></textarea>
					<div class="img_load" v-if="file" >
						<img  :src="$fileUrl+file" view id="photo" class="img_div">
						<img src="/static/img/x-men.png" title="Удалить" class="delete_img" @click="file=''">
					</div>
					<div class="img_load" v-else>
						<img v-if="file" src="" ref="web" class="img_div">
						<input type="file" title="" @change="uploadFile" class="input_load" accept="image/*">
						<span class="load_screen"><img src="/static/img/cam.png" class="cam_load">Загрузить скриншот</span>
					</div>
					</div>
				</div>
				<div class="feed_foot">
					<button class="btn_feed" @click="sendReport" >Отправить</button>
				</div>
			</div>
		</div>
		<!-- web end -->
		<!-- mobile -->
		<div v-if="$mq.phone" class="blocks_feedback">	
			<p class="title">Обратная связь</p>
			<div class="feed_body">
				<p class="text_feed">Возникли трудности в работе с системой?<br> Нашли ошибку или хотите оставить отзыв?<br> Сообщите нам и отправьте скриншот.</p>
				<textarea id="text_feed" v-model="text" placeholder="Опишите вашу проблему..."></textarea>
				<div id="div_for_img">
					<div id="img_load" v-if="!file">
						<input type="file" @change="uploadFile" class="input_load" accept="image/*">
						<span class="load_screen">Загрузить скриншот<img src="/static/img/camb.png" class="cam_load"></span>
					</div>
					<div id="img_load" v-else>
						<img :src="$fileUrl+file" class="img_div">
						<img src="/static/img/x.png" title="Удалить" id="delete_img" @click="file=''">
					</div>
				</div>
			</div>
			<div class="feed_foot">
				<button class="btn_feed" @click="sendReport">Отправить</button>
			</div>
		</div>
		<!-- mobile end -->
	</div>
</template>
<script>
export default {
	name: 'Feedback',
	data () {
		return {
			text: '',
			file: false
		}
	},
	created(){
	},
	methods:{
		sendReport() {
			if(this.text.length>0) {
				this.$http.post('/api', `method=REPORT&&comment=${this.text}&&file=${this.file}`)
				.then(res => {
					if(res.data.status == 200) {
						this.$swal({
							type: 'success',
							title: 'Спасибо вам за обратную связь! Мы обязательно решим вашу проблему!'
						})
						this.file = null
						this.text = ''
					} else {
						this.$swal({
							type: 'error',
							title: 'К сожалению, сейчас мы не можем записать ваш ответ! Попробуйте позже.'
						})
					}
				})
			} else {
				this.$swal({
					type: 'error',
					title: 'Опишите вашу проблему!'
				})
			}
		},
		uploadFile(e) {
			let file = document.querySelector('.input_load').files[0]
			this.$sendFile(file, res => {
				this.file = res.data.name
			})
		}
	}
}
</script>
<style type="text/css" scoped>
	@import url(../../assets/styles/pages/web/feedback.css) (min-width: 768px);
	@import url(../../assets/styles/pages/mobile/feedback.css) (max-width: 768px);
</style>