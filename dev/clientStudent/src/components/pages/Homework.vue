<template>
	<div class="content">
	<!-- web -->
		<p v-if="!$mq.phone" class="page_title">ЗАДАНИЯ<img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered"></p>
		<div v-if="!$mq.phone" class="homework_blocks" >
			<div class="home_head">
				<span class="home_title">Домашнее задание: Урок {{homework.lesson_num}}</span>
			</div>
			<div class="home_body" v-viewer="{movable: true, toolbar: false}">
				<div class="img_video">
					<img v-for="image in images" view :src="$fileUrl+image" class="home_img">
					<video v-for="video in videos" view class="home_video" controls :src="$fileUrl+video"></video>
				</div>
				<div class="text_home">
					<p>{{text}}</p>
				</div>
				<div class="audio_row">
					<div class="audio" :id="'aud'+ i" v-for="(audio, i) in audios">
						<div class="voicePlay" @click="audioControl(i)">
							<img class="playPause" src="/static/img/play.png">
						</div>
						<p class="audio_time">00:00</p>
						<div class="lengthAudio" @click="updateCurrentTime($event, i)">
							<div class="duration"></div>
						</div>
					</div>
				</div>
				<div class="document_row">
					<a class="document" v-for='file in files' target="_blank" :href="$fileUrl + file">
						<img src="/static/img/Doc_icon.png" class="doc_icon">
						<span class="document_name">{{catName(file, 15)}}</span>	
					</a>
				</div>
			</div>
			<div class="home_foot">
				<button class="btn_send_home" @click="clickButton()">
					<span v-if="sended">{{homework.done?'Посмотреть':'Загрузить ответ'}}</span>
					<img v-else src="/static/img/prog.gif" style="width: 50%">
				</button>
				<a :href="$fileUrl+homework.filePath" target='_blank' id = 'filePath' v-show='false'></a>
				<input type="file" id = 'file' @change="sendSolution()" v-show='false'>
			</div>
		</div>
	<!-- web end -->
	<!-- mobile -->
		<div v-if="$mq.phone" class="blocks_homework">
			<p class="title">Домашнее задание: Урок {{homework.lesson_num}}</p>
			<img src="/static/img/prog.gif" class="wait_gif" v-if="!delivered">
			<div class="home_body" v-viewer="{movable: true, toolbar: false}" >
				<div class="img_video" v-if="images.length || videos.length" >
					<img v-for="image in images" view :src="$fileUrl+image" class="home_img">
					<video class="home_video" v-for="video in videos" controls :src="$fileUrl + video"></video>
				</div>
				<div class="text_home">
					<p>{{text}}</p>
				</div>
				<div class="audio_row">
					<div v-for="(audio, i) in audios" class="audio" :id ="'aud'+ i">
						<div class="voicePlay" @click="audioControl(i)">
							<img src="/static/img/play.png" class="playPause">
						</div>
						<p class="audio_time">00:00</p>
						<div class="lengthAudio" @click="updateCurrentTime($event, i)">
							<div class="duration"></div>
						</div>
					</div>
				</div>
				<div class="document_row">
					<a :href="$fileUrl + file" target="_blank" v-for="file in files" class="document">
						<img src="/static/img/Doc_icon.png" class="doc_icon">
						<span class="document_name">{{catName(file, 15)}}</span>	
					</a>
				</div>
			</div>
			<div class="home_foot">
				<button class="btn_send_home" @click="clickButton()">
					<span v-if="sended">{{homework.done?'Посмотреть':'Загрузить ответ'}}</span>
					<img src="/static/img/prog.gif" style="width: 50%" v-if="!sended">
				</button>
				<a :href="$fileUrl+homework.filePath" target='_blank' id = 'filePath' v-show='false'></a>
				<input type="file" id = 'file' @change="sendSolution()" v-show='false'>
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
			homeworkId 	: 0,
			images 		: [],
			videos 		: [],
			audios 		: [],
			files 		: [],
			text 		: '',
			homework 	: {},
			delivered 	: false,
			sended 		: true,
			player 		: new Audio(),
			status 		: false,
			audioTime 	: null,
			progress 	: null,
			button 		: null,
			audio 		: null
		}
	},
	created(){
		this.$http.post('/api', `method=get-homework&&homework=${this.homeworkId}`)
		.then(res => {
			this.homework = res.data.homework
			let contents = res.data.contents
			for(let i=0; i<contents.length; i++) {
				switch(contents[i].type) {
					case 1: this.text = contents[i].content; 			break;
					case 2: this.images.push(contents[i].content);		break;
					case 3: this.audios.push(contents[i].content); 		break;
					case 4: this.files.push(contents[i].content);		break;
					case 5: this.videos.push(contents[i].content);		break;
				}
			}
			this.delivered = true
		})
		.catch(err => {
			this.$router.push('/homeworks')
			console.error(err)
		})
		this.player.addEventListener('timeupdate', ()=>{
			if(this.player.currentTime < 0.5)  	this.button.src = '/static/img/prog.gif'
			else if(!this.status) 				this.button.src = '/static/img/pause.png'
			this.progress.style.width = this.player.currentTime / this.player.duration * 100 + '%'
			this.audioTime.innerHTML = this.convertTime(Math.floor(this.player.currentTime))
			if(this.player.currentTime >= this.player.duration) {
				this.setCurrentAudio(-1)
				this.status = !this.status
			}
		})
	},
	beforeDestroy(){
		this.player.pause()
		this.setCurrentAudio(-1)
	},
	methods: {
		clickButton(){
			if(this.homework.done) 	document.getElementById('filePath').click()
			else 					document.getElementById('file').click()
		},
		sendSolution(){
			let file = document.getElementById('file').files[0]
			this.sended = false
			this.$sendFile(file, res => {
				let name = res.data.name
				this.$http.post('/api', `method=add-solution&&homework=${this.homework.id}&&file=${name}`)
				.then(resp => {
					this.sended = true
					this.homework.filePath = name
					this.homework.done = true
					alert('Файл успешно загружен!')
				})
			})
		},
		catName(name, size) {
			if(name.length <= size + 3) return name
			else return name.substring(0, size) + '...'
		},
		convertTime(seconds){
			let minutes = Math.floor(seconds / 60)
			seconds = seconds - minutes *60
			if(seconds < 10) seconds = '0' + seconds
			if(minutes < 10) minutes = '0' + minutes
			return minutes + ':' + seconds
		},
	 	audioControl(i) {
	 		let name 		= this.audios[i]
			this.setCurrentAudio(i)
			if(this.player.src != this.$fileUrl + name) {
				this.player.src = this.$fileUrl + name
				if(!this.status) this.status = !this.status
			}
			if(!this.status) {
				this.player.pause() 
				this.button.src = '/static/img/play.png'
			} else {
				this.player.play() 
				this.button.src = '/static/img/prog.gif'
			}
			this.status = !this.status
		},
		setCurrentAudio(i) {
			if(this.button) this.button.src = '/static/img/play.png'
			this.audio 		= document.getElementById('aud'+i)
			if(this.audioTime) {
				this.progress.style.width = '0%'
				this.audioTime.innerHTML = '00:00'
			}
			if(i == -1) return
			this.button 	= this.audio.querySelector('.playPause')
			this.audioTime 	= this.audio.querySelector('.audio_time')
			this.progress 	= this.audio.querySelector('.duration')
		},
		updateCurrentTime(e, i) {
			let audio 		= document.getElementById('aud'+i)
			if(this.audio == audio) {
				let current 	= e.offsetX
				let all			= this.progress.parentNode.offsetWidth
				let duration 	= this.player.duration
				this.player.currentTime = current*duration/all 
			}
		}
	}
}
</script>
<style type="text/css" scoped>
	@import url(../../assets/styles/pages/web/homework.css) 	(min-width: 768px);
	@import url(../../assets/styles/pages/mobile/homework.css) 	(max-width: 768px);
</style>
