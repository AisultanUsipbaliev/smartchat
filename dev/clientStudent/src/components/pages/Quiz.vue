<template>
	<div class="content">
		<div class="quiz-block">
			<div class="quiz-infohead">
				<div class="quiz-name">Задание: {{quiz.name}}</div>
				<div class="quiz-level">Уровень: {{quiz.lvl_name}}</div>
			</div>
			<div class="quiz-body" v-viewer="{movable: false}">
				<div class="droped-block" v-for="(content, q) in contents" :id="'content'+q" :class = "[content.error? 'quizError':'']">
					<div class="text-quiz-block block-q" v-if="content.type == 1">
						<span class="indexes">{{q + 1}}</span>
						<p class="text-quiz-teacher">{{content.content}}</p>
					</div>
					<div class="text-quiz-block block-q" v-if="content.type == 2">
						<span class="indexes">{{q + 1}}</span>
						<span class="question-in-block">Вопрос: {{content.content.question}}</span>
						<label :for="'id' + a" v-for="(answers, a) in content.content.answers" :key='a' @click="content.content.answer = a" class="answer-row-hw">
							<input type="radio" :name="'id' + q" :id="'id' + a">
							<span class="checkmark"></span>
							<span class="answer-text">{{answers.answer}}</span>
						</label>
					</div>
					<div class="teacher-audio-block block-q" v-if="content.type == 3" @touchend="(event)=>{event.stopPropagation()}">
						<span class="indexes">{{q + 1}}</span>
						<div class="audios">
							<div v-for='audio in content.content'>
								<player  :srcer='$fileUrl + audio'></player>
							</div>
						</div>
					</div>
					<div class="block-q" v-if="content.type == 4" @touchend="(event)=>{event.stopPropagation()}"> 
						<span class="indexes">{{q + 1}}</span>
						<div class="gallery-block">
							<div class="item-gb" v-for="img in content.content">
								<img :src="$fileUrl + img.file" view class="image-quiz" v-if="img.type == 1">
								<video :src="$fileUrl + img.file" class="image-quiz" v-if="img.type == 2" controls></video>
							</div>
						</div> 
					</div>
					<div class="quiz-document-block block-q" v-if="content.type == 5" @touchend="(event)=>{event.stopPropagation()}">
						<span class="indexes">{{q + 1}}</span>
						<div class="doc-block">
							<a download="true" class="downloadFile" target="_blank" v-for="doc in content.content" :href="$fileUrl + doc.file">
								<fai icon="file" class="doc-icon"/>
								<div class="doc-info">
									<span class="doc-name">{{doc.name}}</span>
									<span class="doc-size">{{getSize(doc.size)}}</span>
								</div>
							</a>
						</div>
					</div>
					<div class="text-student-block block-q" v-if="content.type == 6">
						<span class="indexes">{{q + 1}}</span>
						<textarea class="input-student" @focus='content.errorText = null' placeholder="Напишите ответ" v-model="content.content"></textarea>
					</div>
					<div class="audio-student-block block-q" v-if="content.type == 7">
						<span class="indexes">{{q + 1}}</span>
						<div class="audios" v-if="content.content.length">
							<div class="deletedDiv" v-for='(audio, audI) in content.content'>
								<player :srcer='audio.url'></player>
								<fai @click="content.content.splice(audI, 1)" icon="trash" class="delete-audio" title="Удалить"/>
							</div>
						</div>
						<div class="record-row" v-if="!content.content.length">
							<fai icon="microphone" @click="recorderClick(q)" class="SmartRecords" :class="content.recording ? 'animated-record' : '' "/>
							<span class="record-title">{{content.recording ? 'Остановить запись' : 'Нажмите на микрофон чтобы начать запись'}}</span>
						</div>
					</div>
					<div class="document-student-block block-q" v-if="content.type == 8" @touchend="(event)=>{event.stopPropagation()}">
						<span class="indexes">{{q + 1}}</span>
						<div class="documents-quiz">
							<a class="downloadFile" v-for="(doc, m) in content.content" :href="doc.url" target="_blank">
								<fai icon="file" class="doc-icon"/>
								<div class="doc-info">
									<span class="add-doc-name">{{doc.file.name}}</span>
									<span class="doc-size">{{getSize(doc.file.size)}}</span>
								</div>
								<fai icon="trash" class='delete-added' title="Удалить" @click="content.content.splice(m, 1)"/>
							</a>
							<label :for="'file' + q" class="add-title-quiz" v-if="content.content.length == 0">Нажмите на + чтобы загрузить документ</label>
							<label :for="'file' + q" class="add-doc"><fai icon='plus'/></label>
							<input type="file" :id="'file' + q" style="display: none;" @change="(e)=>{setDocument(e, q);}">
						</div>
					</div>
					<div class="text-student-block block-q" v-if="content.type == 9" @touchend="(event)=>{event.stopPropagation()}">
						<span class="indexes">{{q + 1}}</span>
						<div class="gallery-student">
							<div class="videoblock" v-for="(video, v) in content.content">
								<video :src="video.url" class="videodrop" controls></video>
								<fai icon="trash" class='delete-video' title="Удалить" @click="content.content.splice(v, 1)"/>
							</div>
							<label :for="'file' + q" class="add-title-quiz" v-if="content.content.length == 0">Нажмите на + чтобы загрузить видеофайл</label>
							<label :for="'file' + q" class="add-doc">
								<fai icon='plus'/>
							</label>
							<input type="file" :id="'file' + q" style="display: none;" accept="video/*" @change="(e)=>{setVideo(e, q)}">
						</div>
					</div>
					<div class="text-student-block block-q" v-if="content.type == 10" @touchend="(event)=>{event.stopPropagation()}">
						<span class="indexes">{{q + 1}}</span>
						<div class="gallery-student">
							<div class="pictureblock" v-for="(picture, p) in content.content">
								<img :src="picture.url" view class="picturedrop">
								<fai icon="trash" class='delete-picture' title="Удалить" @click="content.content.splice(p, 1)"/>
							</div>
							<label :for="'file' + q" class="add-title-quiz" v-if="content.content.length == 0">Нажмите на + чтобы загрузить картинку</label>
							<label :for="'file' + q" class="add-doc">
								<fai icon='plus'/>
							</label>
							<input type="file" :id="'file' + q" accept="image/*" style="display: none;" @change="(e)=>{setPicture(e, q)}">
						</div>
					</div>
				<h3 v-if='content.errorText' class='errorText'>{{content.errorText}}</h3>
				</div>
				<div class="Sandy" @click='send'>Отправить</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import Recorder from 'recorder-js'
	import Player from '@/components/partials/audio_player'
	export default{
		name: 'Quiz',
		components: {Player},
		data(){
			return {
				quiz: {
					name: '',
					lvl_name: ''
				},
				contents: [],
				quizId: 19,
				recorder: null,
				gumStream: null
			}
		},
		async mounted(){
			let that = this
			this.quizId = this.$route.query.id
			if(!this.quizId) top.location.href = '/quizlist'

			this.$http.post('/api', `method=get-quiz&&quizId=${this.quizId}`)
			.then(res => {

				if(res.status != 200) return this.$router.push('/quizlist')

				if(res.data.quiz.completed) this.$router.push('/quizresult?id='+this.quizId)
				
				this.quiz = res.data.quiz

				let mas = res.data.quiz.contents
				for(let i=0; i<mas.length; i++) 
					mas[i] = this.execRules(mas[i])
				this.contents = mas

			})
		},
		methods:{
			setVideo(event, index){
				this.contents[index].errorText = null
				let doc = event.target.files[0];
				this.contents[index].content.push({file: doc, url: URL.createObjectURL(doc)})
			},
			setDocument(event, index){
				this.contents[index].errorText = null
				let doc = event.target.files[0]
				this.contents[index].content.push({file: doc, url: URL.createObjectURL(doc), size: doc.size, name: doc.name})
			},
			setPicture(event, index){
				this.contents[index].errorText = null
				let doc = event.target.files[0]
				this.contents[index].content.push({file: doc, url: URL.createObjectURL(doc)})
			},
			getSize(size){
				let sizeN = 0;
				if(size >= 1024000){
					while(size >= 1024000){
						size -=1024000;
						sizeN++;
					}
					size = `\'${size}\'`;
					sizeN += '.' + size[1] + size[2]
					sizeN +='Mb'
				}else{
					while(size >= 1024){
						size -=1024;
						sizeN++;
					}
					sizeN +='Kb'
				}
				return sizeN;
			},
			async send() {
				if(!this.validate()) return
				let options = {
					method: 'POST',
					headers: { 'content-type': 'application/form-data' },
					url: '/api',
					withCredentials: true
				}
				this.$swal({
					title: 'Отправляем запрос. Это займет пару минут...',
					onBeforeOpen: async () => {
						this.$swal.showLoading()
						for(let i=0; i<this.contents.length; i++) {
							if([7,9,10].includes(this.contents[i].type)) {
								for(let j=0; j<this.contents[i].content.length; j++) {
									options.data = new FormData()
									options.data.append('uploadFile', this.contents[i].content[j].file)
									options.data.append('method', 'SENDFILE')
									let res = await this.$http(options)
									this.contents[i].content[j] = res.data.name
								}
							}
							if([8].includes(this.contents[i].type)) {
								for(let j=0; j<this.contents[i].content.length; j++) {
									options.data = new FormData()
									options.data.append('uploadFile', this.contents[i].content[j].file)
									options.data.append('method', 'SENDFILE')
									let res = await this.$http(options)
									this.contents[i].content[j] = { 
										file: res.data.name,
										size: this.contents[i].content[j].size,
										name: this.contents[i].content[j].name
									}
								}
							}
						}
						let res = await this.$http.post('/api', 
							`method=send-quiz&&quizId=${this.quizId}&&contents=${JSON.stringify(this.contents)}`)
						this.$swal.hideLoading()
						if(res.status == 200) {
							this.$swal({
								type: 'success',
								title: 'Успешно записано!',
								text: `Совсем скоро преподаватель проверит ваше решение`
							})
							this.$socket.send(JSON.stringify({notice: 3, quiz_id: this.quizId}))
							this.$router.push('/quizresult?id='+this.quizId)
						} else {
							this.$swal({
								type: 'error',
								title: 'Произошла ошибка. Попробуйте позже.'
							})
						}
					}
				})
			},
			validate(){
				for(let i=0; i<this.contents.length; i++)
					this.contents[i].errorText = null
				for(let i=0; i<this.contents.length; i++) {
					let content = this.contents[i]
					switch(content.type) {
						case 2: 
							if(content.content.answer == -1) {
								this.showError(i)
								return false
							}
							break
						case 6:
							if(!content.content.length) {
								this.showError(i)
								return false
							}
							break
						case 7:
							if(!content.content.length) {
								this.showError(i)
								return false
							}
							break
						case 8:
							if(!content.content.length) {
								this.showError(i)
								return false
							}
							break
						case 9:
							if(!content.content.length) {
								this.showError(i)
								return false
							}
							break
						case 10:
							if(!content.content.length) {
								this.showError(i)
								return false
							}
							break
					}
				}
				return true
			},
			showError(i) {
				this.contents[i].error = true
				this.contents[i].errorText = '*Вы не заполнили поле'
				top.location.href = '#'
				top.location.href += 'content'+i
				setTimeout(()=>{
					this.contents[i].error = false
				},2000)	
			},
			recorderClick(i) {
				if(this.contents[i].recording) {
					this.stopRecord(i)
					this.contents[i].recording = false
				} else {
					for(let j=0; j<this.contents.length; j++) 
						if(this.contents[j].type == 7 && this.contents[j].recording) {
							this.$swal({ type: 'error', title: 'Вы не можете начать новую запись, пока не закончили текущую!' })
							return
						}
					this.startRecord(i)
					this.contents[i].recording = true
				}
			},
			startRecord(i){
				navigator.mediaDevices.getUserMedia({audio: true, video:false})
				.then(stream =>{
					this.recorder = new Recorder(new (window.AudioContext || window.webkitAudioContext)(), {})
					this.gumStream = stream;
					this.recorder.config.nFrequencyBars = 8000;
					this.recorder.init(this.gumStream)
					this.recorder.start(10)
				})
				.catch(err =>{
					console.error(err)
				});
			},
			stopRecord(i){
				let traks = this.gumStream.getTracks()
				for(let i=0; i<traks.length; i++ ) traks[i].stop()
				this.recorder.stop()
				.then(datablob =>{
					let blob = datablob.blob;
					this.contents[i].content.push({file: blob, url: URL.createObjectURL(blob)})
				})
			},
			execRules(cont) {
				if([2,3,4,5].includes(cont.type)) {
					cont.content = JSON.parse(cont.content)
				}
				if([6].includes(cont.type)) {
					cont.content = ''
				}
				if([7,8,9,10].includes(cont.type)) {
					cont.content = []	
				}
				if([2, 6, 7, 8, 9, 10].includes(cont.type)) {
					cont.errorText = ''
					cont.error = false
				}
				if([7].includes(cont.type)) {
					cont.recording = false	
				}
				if([2].includes(cont.type)) {
					cont.content.answer = -1	
				}
				return cont
			}
		}
	}
</script>

<style type="text/css" scoped>
	@import url(../../assets/styles/pages/web/quiz.css);
</style>