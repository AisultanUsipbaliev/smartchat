<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content" @mousedown="(event)=>{startSwipe(event)}" @mouseup="(event)=>{endSwipe(event)}">
		<loading v-if="loading"></loading>
		<div class="add-homework">
			<!-- Холст -->
			<div class="work-zone">
				<div class="work-zone-settings">
					<input v-model='name' type="text" autofocus="true" placeholder="Введите название" class="add-homework-name">
					<select v-model='level' class="add-homework-select">
						<option v-for="lvl in levels" :value="lvl.lvl_id" style="color: #000">{{lvl.lvl_name}}</option>
					</select>
				</div>
				<div class="work-zone-body">
					<div v-for="(element, index) in contents" :id="'content'+index" :class="[element.errorClass?'quizError':'']" class="droped-block">
						<div class="iteration">
							{{index + 1}}
						</div>

						<fai @click="contents.splice(index, 1)" icon="trash-alt" class="delete-droped-block" title="Удалить" />

						<textarea v-if='element.type == 1' v-model='element.content' class="droped-input" placeholder="Введите текст"></textarea>

						<div v-if='element.type == 2' class="droped-question">
							<input v-model='element.content.question' type="text" class="input-question quest" placeholder="Напишите вопрос">
							<div v-for='(answer, a) in element.content.answers' class="option-block">
								<input @click="element.content.correct = a" :name="'answer' + index" type="radio">
								<span>{{$functions.getLetter(a+1)}}</span>
								<input v-model='answer.answer' type="text" class="input-option quest" placeholder="Вариант ответа">
								<img @click="element.content.answers.splice(a, 1)" src="/static/img/cancel.png" class="delete-option-question">
							</div>
							<label @click="element.content.answers.push({answer: ''})" v-if="element.content.answers.length < 15" class="plusLabel">
								<fai icon="plus" class="add-question-option" title="Добавить вариант ответа"/>
							</label>
						</div>

						<div v-if='element.type == 3' class="droped-audio" @touchend="(event)=>{event.stopPropagation()}">
							<span v-for='(audio, a) in element.content'>
								<div v-if="audio == 'blank'" class="flex-button">
									<fai @click="startRecording(index)" icon="microphone-alt" class="record-svg" title="Записать аудио"/>
									<label @click="addFile(index, element.type)" ><fai icon="file-download" title="Загрузить" class="download-svg"/></label>
								</div>
								<div @click="stopRecording" v-else-if="audio == 'record'" class="brings">
									<fai icon="microphone-alt" class="animate-recording"/>
									<span class="animate-title">Нажмите чтобы остановить</span>
								</div>
								<div v-else class="audio-trash">
									<audio-player :srcer='$fileUrl + audio'></audio-player>
									<fai @click="element.content.splice(a, 1)" icon="trash-alt" title="Удалить" class="trashing"/>
								</div>
							</span>
						</div>

						<div v-viewer="{movable: true}" v-if='element.type == 4' class="droped-pictures" @touchend="(event)=>{event.stopPropagation()}">
							<div class="droped-img-block">
								<span v-for='(media, m) in element.content' class="mediaBlock">
									<img view v-if='media.type == 1' :src="$fileUrl + media.file" class="droped-img">
									<video v-else :src="$fileUrl + media.file" controls="true" class="droped-img"></video>
									<fai @click="element.content.splice(m,1)" icon="trash-alt" title="Удалить" class="delete-picture"/>
								</span>
							</div>
							<label @mouseup="addFile(index, element.type)" class="droped-img-plus">
								<fai icon="plus" class="droped-img"/>
							</label>
						</div>

						<div v-if='element.type == 5' class="droped-document" @touchend="(event)=>{event.stopPropagation()}">
							<div v-for='(file, d) in element.content' class="droped-document-block">
								<div class="document-block-homie">
									<fai class="doc-icon" icon="file"/>
									<div class="info-doc-added-hw">
										<span class="doci-name">{{file.name}}</span>
										<span class="doci-size">{{$functions.getSize(file.size)}}</span>
									</div>	
									<fai @click="element.content.splice(d, 1)" icon="trash-alt" title="Удалить" class="trashing"/>
								</div>
							</div>
							<label @click="addFile(index, element.type)" class="droped-doc-plus">
								<fai icon="plus" class="droped-doc"/>
							</label>
						</div>

						<p v-if='element.type == 6' class="droped-student" >Письменный ответ</p>
						<p v-if='element.type == 7' class="droped-student" >Аудио-ответ</p>
						<p v-if='element.type == 8' class="droped-student" >Документ-ответ</p>
						<p v-if='element.type == 9' class="droped-student" >Видео-ответ</p>
						<p v-if='element.type == 10' class="droped-student" >Фото-ответ</p>

						<p v-if='element.error' class="fckng">{{element.error}}</p>

					</div>

					<div class="plus">
						<fai icon="plus" @click="popup = true"/>
					</div>

				</div>
				<div class="buttons-add-homework">
					<button @click='save' class="save-addhm bthm" v-if="$mq.phone">Сохранить</button>
					<router-link to="/homeworks" v-if="$mq.phone">
						<button class="cancel-addhm bthm">Отмена</button>
					</router-link>
				</div>
			</div>

			<!-- Элементы -->
			<div class="elements-block" v-if="$mq.phone ? popup : true" @click='popup=false'>
				<div class="block-with-files">
					<p class="elements-title">Элементы</p>
					<p class="element-row" v-for="(type, i) in types" @click = 'addElement(i+1)'>
						<fai icon="hand-pointer" class="element-hand"/>
						{{type}}
					</p>
				</div>
				<div class="buttons-add-homework" v-if="!$mq.phone">
					<button @click="save" class="save-addhm bthm" v-if="!$mq.phone">Сохранить</button>
					<router-link to="/homeworks" v-if="!$mq.phone">
						<button class="cancel-addhm bthm">Отмена</button>
					</router-link>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import Recorder from 'recorder-js'
	import audioPlayer from '@/components/partials/audio_player'
	export default{
		name: 'NewQuiz',
		components:{
			audioPlayer
		},
		data(){
			return{
				types: ['Текст','Вопрос','Аудиозапись','Галерея','Документ',
				'Письменный ответ','Аудио-ответ','Документ-ответ','Видео-ответ', 'Фото-ответ'],
				levels: [],
				contents: [],
				new: true,
				saved: false,
				level: 1,
				name: '',
				loading: false,
				popup: false,
				recorder: null,
				gumStream: null,
				recordingIndex: null,
				id: null
			}
		},
		beforeRouteLeave (to, from, next){
			if(!this.saved) {
				if(confirm('Вы хотите покинуть страницу? Не сохраненные данные будут удалены!')) {
					next(true);
				} else {
					next(false);
				}
			}else next(true);
		},
		mounted(){
			this.getLevels()
			this.id = this.$route.query.id
			if(this.id) 
				this.$http.post('/api', `method=get-quiz&&quiz_id=${this.id}`)
				.then(res => {
					if(res.status == 200) {
						this.new = false
						this.name = res.data.quiz.name
						this.level = res.data.quiz.level
						let mas = res.data.quiz.contents

						for(let i=0; i<mas.length; i++) { 
							if([2,3,4,5].includes(mas[i].type))
								mas[i].content = JSON.parse(mas[i].content)
							if(mas[i].type == 3) 
								mas[i].content.push('blank')
						}

						this.contents = mas
					}
				})
				.catch(err => { this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-QUIZ'}) })
		},
		methods:{
			startSwipe(event){
				// console.log(event)
			},
			endSwipe(event){
				// console.log(event)
			},
			async save(){
				if(!(await this.validate())) return
				this.loading = true
				await this.beforeSend()

				if(this.new) {

					this.$http.post('/api',`method=add-quiz&&name=${this.name}&&level=${this.level}&&contents=${JSON.stringify(this.contents)}`, )
					.then(res => {
						if(res.status == 200){
							this.$swal({
								type: 'success',
								title: 'Успешно сохранено!'
							})
							this.saved = true
							this.$router.push('/homeworks')
						}
					})
					.catch(err => { this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'ADD-QUIZ'}) })
				} else {
					this.$http.post('/api',`method=update-quiz&&quiz_id=${this.id}&&name=${this.name}&&level=${this.level}&&contents=${JSON.stringify(this.contents)}`, )
					.then(res => {
						if(res.status == 200){
							this.$swal({
								type: 'success',
								title: 'Успешно сохранено!'
							})
							this.saved = true
							this.$router.push('/homeworks')
						}
					})
					.catch(err => { this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'UPDATE-QUIZ'}) })
				}
			},
			validate(){
				let hasEssentialElement = false

				if(!this.name.length) {
					this.$swal({
						type: 'error',
						title: 'Укажите название задания'
					})
					return false
				}

				if(!this.contents.length) {
					this.$swal({
						type: 'error',
						title: 'Добавьте элементов'
					})
					return false
				}


				for(let i=0; i<this.contents.length; i++) {
					Vue.set(this.contents[i], 'error', null)
					if(this.contents[i].type > 5)	hasEssentialElement = true
					switch(this.contents[i].type) {
						case 1:
							this.contents[i].content = this.contents[i].content.trim()  
							if(!this.contents[i].content.length) {
								this.showError(i, '*Вы не заполнили это поле')
								return false
							}
							break
						case 2:
							this.contents[i].content.question = this.contents[i].content.question.trim()
							if(!this.contents[i].content.question.length) {
								this.showError(i, '*Напишите ваш вопрос')
								return false
							}
							if(this.contents[i].content.answers.length < 2) {
								this.showError(i, '*Необходимо минимум 2 варианта ответа')
								return false
							}
							for(let a=0; a<this.contents[i].content.answers.length; a++) {
								this.contents[i].content.answers[a].answer = this.contents[i].content.answers[a].answer.trim()
								if(!this.contents[i].content.answers[a].answer.length) {
									this.showError(i, '*Не все ответы заполнены')
									return false
								}
							}
							if(!this.contents[i].content.correct && this.contents[i].content.correct != 0) {
								this.showError(i, '*Укажите правильный ответ')
								return false
							}
							break
						case 3:
							if(this.contents[i].content.length<2) {
								this.showError(i, '*Добавьте или запишите аудио')
								return false
							}
							break
						case 4:
							if(!this.contents[i].content.length) {
								this.showError(i, '*Добавьте фото или видео')
								return false
							}
							break
						case 5:
							if(!this.contents[i].content.length) {
								this.showError(i, '*Добавьте документ')
								return false
							}
							break
					}
				}

				if(!hasEssentialElement) {
					this.$swal({
						type: 'error',
						title: 'Вы должны добавить ответы'
					})
				}

				return hasEssentialElement
			},
			beforeSend(){
				for(let i=0; i<this.contents.length; i++) 
					if(this.contents[i].type == 3) 
						this.contents[i].content.pop()
			},
			addElement(type){
				switch(type) {
					case 1: this.contents.push({type, content: ''}); break
					case 2: this.contents.push({type, content: {answers: [{answer:''},{answer:''}], question: ''}}); break
					case 3: this.contents.push({type, content: ['blank']}); break
					case 4: this.contents.push({type, content: []}); break
					case 5: this.contents.push({type, content: []}); break
					case 6: this.contents.push({type, content: ''}); break
					case 7: this.contents.push({type, content: ''}); break
					case 8: this.contents.push({type, content: ''}); break
					case 9: this.contents.push({type, content: ''}); break
					case 10: this.contents.push({type, content: ''}); break
				}
			},
			addFile(index, type) {
				let input = document.createElement('input')
				input.type = "file" 
				switch(type) {
					case 3: input.accept = "audio/*"; break
					case 4: input.accept = "image/*, video/*"; break
				}
				input.click()
				input.onchange = () => {
					let file = input.files[0]
					let url = URL.createObjectURL(file)
					this.loading = true
					this.$sendFile(file, (res) => {
						this.loading = false
						switch(type) {
							case 3:
								this.contents[index].content.pop()
								this.contents[index].content.push(res.data.name)
								this.contents[index].content.push('blank')
							break
							case 4: 
								this.contents[index].content.push({file: res.data.name, type: file.type.indexOf('image')>-1? 1:2})
								break
							case 5:
								this.contents[index].content.push({
									name: file.name,
									file: res.data.name,
									size: file.size,
								})
								break;
						}
					})
				}
			},
			startRecording(index){

				if(this.recordingIndex || this.recordingIndex == 0) { 
					this.$swal({
						type: 'error',
						title: 'Вы не можете начать новую запись, пока не закончите текущую'
					})
					return
				}

				for(let i=0; i<this.contents[index].content.length; i++) {
					if(this.contents[index].content[i] == 'blank')
						Vue.set(this.contents[index].content, i, 'record')
				}

				this.recordingIndex = index

				navigator.mediaDevices.getUserMedia({audio: true, video:false})
				.then(stream =>{
					this.recorder = new Recorder(new (window.AudioContext || window.webkitAudioContext)(), {})
					this.gumStream = stream;
					this.recorder.config.nFrequencyBars = 8000;
					this.recorder.init(this.gumStream)
					this.recorder.start(10)
				})
				.catch(err =>{
					this.$swal({
						type: 'error',
						title: 'Ваше устройство не поддерживает аудиозапись!'
					})
					this.contents[this.recordingIndex].content.pop()
					this.contents[this.recordingIndex].content.push('blank')
					this.recordingIndex = null
				})
			},
			stopRecording() {
				let traks = this.gumStream.getTracks()
				for(let i=0; i<traks.length; i++ ) traks[i].stop()
				this.recorder.stop()
				.then(datablob =>{
					let blob = datablob.blob;
					this.$sendFile(blob, (res) => {
						this.contents[this.recordingIndex].content.pop()
						this.contents[this.recordingIndex].content.push(res.data.name)
						this.contents[this.recordingIndex].content.push('blank')
						this.recordingIndex = null
					})
				})
			},
			showError(index, text) {
				Vue.set(this.contents[index], 'error', text)
				Vue.set(this.contents[index], 'errorClass', true)
				top.location.href = '#'
				top.location.href += 'content'+index
				setTimeout(() => Vue.set(this.contents[index], 'errorClass', false), 2000)
			},
			getLevels(){
				this.$http.post('/api', `method=GET-LEVELS`)
				.then( res => this.levels = res.data.levels )
				.catch(err => { this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-LEVELS'}) })
			},
		}
	}
</script>

<style>
	@import url(../../assets/css/homeworks.css)
</style>