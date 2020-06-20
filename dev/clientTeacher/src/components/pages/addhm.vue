<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
		<loading v-if="loading"></loading>
		<div class="go_to_trash"></div>
		<!-- <div class="trash" ref="trash" v-if="trash"> -->
			<!-- <div class="body">
				<div class="head">
					<div class="circle"></div>
				</div>
				<div class="trapezoid">
					<div class="stick left"></div>
					<div class="stick middl"></div>
					<div class="stick right"></div>
				</div>	
			</div> -->
		<!-- </div> -->
		<div class="add-homework" ref="zone">
			<div class="work-zone">
				<!-- <p class="work-zone-title">Перетащите элемент, которые вам нужны и составьте задание для студента</p> -->
				<div class="work-zone-settings">
					<div class="work-zone-settings">
						<input type="text" placeholder="Название задания" :style="quiz.name_err ? {borderBottom: '1px solid red'} : ''" v-model="quiz.name"
						class="add-homework-name" @focus="quiz.name_err = false">
						<select class="add-homework-select" :style="quiz.level_err ? {borderBottom: '1px solid red'} : ''" v-model="quiz.level" @focus="quiz.level_err = false">
							<option v-for="level in levels" :value="level.lvl_id" style="color: #000">{{level.lvl_name}}</option>
						</select>
					</div>
					<div v-if="$mq.phone" class="work-zone-settings">
						<button class="save-addhm bthm" @click="saveHw(); noConfirm = true">Сохранить</button>
						<router-link to="/homeworks"><button @click="noConfirm = true" class="cancel-addhm bthm">Отмена</button></router-link>
					</div>
				</div>
				<div class="work-zone-body" ref="body">
					<div class="droped-block" v-for="(content, j) in quiz.contents" :key="j" @mousedown="(e) => {if(e.target.classList== 'droped-block')takeType(e, content.type, content, j)}">
						<div class="iteration">
							<fai icon="chevron-up" title="Вверх"  v-if="j != 0" @click="swapContent(1, j)"/>	
							{{j+1}}
							<fai icon="chevron-down" title="Вниз" v-if="j != quiz.contents.length - 1"  @click="swapContent(0, j)"/>	
						</div>
						<fai icon="trash-alt" @click="deleteBlock(j)" class="delete-droped-block" title="Удалить" />
						<textarea class="droped-input" placeholder="Введите текст" :style="content.content_err ? {borderColor: 'red'} : ''" v-if="content.type === 1" v-model="content.content" @focus="content.content_err = false"></textarea>
						<div class="droped-audio" v-if="content.type === 3" :style="content.name_err ? {borderColor: 'red'} : ''" @click="content.name_err = false">
							<audio-recorder :srcer="content.audio ? content.audio : content.file ? $fileUrl + content.content : ''" @audio-src="e=>sendAudio(e, content)" style="z-index: 10"></audio-recorder>
						</div>
						<div class="droped-question" v-if="content.type === 2" :style="content.content.correct_err || content.content.content_err ? {border: '1px solid #f00'} : ''">
							<input type="text" class="input-question quest" placeholder="Напишите вопрос" :style="content.content.question_err ? {borderColor: 'red'} : ''" v-model="content.content.question" @focus="content.content.question_err ? content.content.question_err = false : ''">
							<div class="option-block" v-for="(answer, q) in content.content.answers">
								<input type="radio" :name="'quest'+j" @click="content.content.correct = q; content.content.correct_err = false" class="radio-option" :checked="content.content.correct == q ? true : false">
								<span>{{$functions.getLetter(q+1)}})</span>
								<input type="text" class="input-option quest" placeholder="Вариант ответа" :style="answer.answer_err ? {borderColor: 'red'} : ''" v-model="answer.answer" @focus="answer.answer_err ? answer.answer_err = false : ''">
								<img src="/static/img/cancel.png" class="delete-option-question" @click="deleteAnswer(content.content, q)">
							</div>
							<fai icon="plus"class="add-question-option" title="Добавить вариант ответа" @click="content.content.answers.push({answer: ''})"/>
						</div>

						<div class="droped-pictures" v-if="content.type === 4">
							<span v-if="content.content_err" class="content_error">Нельзя сохранить пустую галерею!</span>
							<div class="droped-img-block" v-for="(img, q) in content.content" @click="(e)=>{e.preventDefault();content.content.splice(q,1)}">
									<img :src="img.blob ? img.precontent : $fileUrl + img.file" class="droped-img" v-if="img.type === 2">
									<video :src="img.blob ? img.precontent : $fileUrl + img.file" controls="true" class="small-picture" v-else></video>
							</div>
							<label :for="'file'+j" class="droped-img-plus">
								<fai icon="plus" class="droped-img"/>
							</label>
							<input type="file" :id="'file'+j" accept="image/*, video/*" style="display: none;" @change="(e)=>{setGalery(e, content); content.content_err = false}">
						</div>
						
						<div class="droped-document" v-if="content.type === 5">
							<span v-if="content.content_err" class="content_error">Нельзя сохранить пустой документ!</span>
							<div class="droped-document-block" v-for="(doc, d) in content.content">
								<div class="document-block-homies">
									<img class="doc-icon" :src="doc.type !== 2 ? '/static/img/doc_icon.png'
																											 			 : doc.blob ? doc.precontent : $fileUrl + doc.file">
									<div class="info-doc-added-hw">
										<span class="doci-name">{{doc.name}}</span>
										<span class="doci-size">{{$functions.getSize(doc.size)}}</span>
									</div>
								</div>
								<!-- <img :src="doc.blob ? doc.precontent : $fileUrl + doc.file" class="small-picture" v-if="doc.type === 2">
								<audio-player v-if="doc.type === 3" :srcer="doc.blob ? doc.precontent : $fileUrl + doc.file"></audio-player>
								<video :src="doc.blob ? doc.precontent : $fileUrl + doc.file" v-if="doc.type === 5" controls="true" class="small-picture"></video> -->
							</div>
								<label :for="'file' + j" class="droped-doc-plus">
									<fai icon="plus" class="droped-doc"/>
								</label>
								<input type="file" accept="*/" :id="'file' + j" style="display: none;" @change="(e)=>{setDocument(e, content); content.content_err = false}">
						</div>
						<p class="droped-student" v-if="content.type === 6">Студент введет текст</p>
						<p class="droped-student" v-if="content.type === 7">Студент запишет аудио</p>
						<p class="droped-student" v-if="content.type === 8">Студент добавит документ</p>
						<p class="droped-student" v-if="content.type === 9">Студент добавит видео</p>
						<p class="droped-student" v-if="content.type === 10">Студент добавит картинки</p>
					</div>
					<div class="plus">
						<fai icon="plus" @click="popup = true"/>
					</div>
				</div>
			</div>

			<div class="elements-block" v-if="$mq.phone ? popup ? true : false : true">
				<div class="block-with-files">
					<p class="elements-title">Элементы</p>
					<p class="element-row" v-for="(type, i) in types" :key="i" @mousedown="(e) => {takeType(e, i+1)}">
						<fai icon="hand-pointer" class="element-hand"/>
						{{type}}
					</p>
				</div>
				<div class="buttons-add-homework">
					<button class="save-addhm bthm" v-if="!$mq.phone" @click="saveHw(); noConfirm = true">Сохранить</button>
					<router-link to="/homeworks" v-if="!$mq.phone"><button @click="noConfirm = true" class="cancel-addhm bthm">Отмена</button></router-link>
					<button  @click="popup = false" class="cancel-addhm bthm" v-else>Отмена</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import audioPlayer from '@/components/partials/audio_player'
	import audioRecorder from '@/components/partials/audio_recorder'
	export default{
		name: 'AddHomework',
		components:{
			audioPlayer,
			audioRecorder
		},
		data(){
			return{
				msg: 'AddHomework',
				types: ['Текст','Вопрос','Аудиозапись','Галерея','Документ','Текст студента','Аудио студента','Документ студента'],
				quiz: {},
				levels: [],
				recording: false,
				noConfirm: false,
				loading: false,
				popup: false,
				trash: false,
			}
		},
		beforeRouteLeave (to, from, next){
			if (this.noConfirm == false) {
				let joke = confirm('Вы хотите покинуть страницу? Не сохраненные данные будут удалены!')
				if(!joke)	next(false) 
				else next(true)
			} else next(true)
		},
		mounted(){
			this.getLevels();
			let id = Number(this.$route.params.id)
			if(Number.isInteger(id))
				this.getHomework(id);
			else{
				Vue.set(this.quiz, 'level', 1);
				Vue.set(this.quiz, 'contents', [{type: 1,content: ''},{type: 6}]);
			}
		},
		methods:{
			deleteAnswer(content, index){
			content.answers.splice(index, 1)
			if(content.correct)
				if(content.correct > index)
					content.correct--;
				else if(content.correct == index)
					content.correct = undefined;
			},
			sendAudio(event, content){
				Vue.set(content, 'audio', event.audio);
				Vue.set(content, 'content', event.file);
	    },
			async saveHw(){
				if(this.validateHw()){
					this.loading = true;
					await this.sendFiles();
					if(this.quiz.id)
						this.$http.post('/api', `method=UPDATE-QUIZ&quiz_id=${this.quiz.id}&name=${this.quiz.name}&level=${this.quiz.level}&contents=${JSON.stringify(this.quiz.contents)}`)
						.then(res => { if(res.status === 200) this.$router.replace({ path: '/homeworks' }) })
						.catch(err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'UPDATE-QUIZ'}) )
						.finally( () => this.loading = false )
					else
						this.$http.post('/api', `method=ADD-QUIZ&name=${this.quiz.name}&level=${this.quiz.level}&contents=${JSON.stringify(this.quiz.contents)}`)
						.then(res => { if(res.status === 200) this.$router.replace({ path: '/homeworks' }) })
						.catch(err => { this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'ADD-QUIZ'}) })
						.finally( () => this.loading = false )
				}
			},
			async sendFiles(){
				for(let i = 0; i < this.quiz.contents.length; i++){
					if(this.quiz.contents[i].type === 4 || this.quiz.contents[i].type === 5)
						for(let j = 0; j < this.quiz.contents[i].content.length; j++)
							if(this.quiz.contents[i].content[j].blob)
							await this.$sendFile(this.quiz.contents[i].content[j].blob, res => {
								if(res.status === 200){
									this.quiz.contents[i].content[j].file = res.data.name;
									this.quiz.contents[i].content[j].blob = '';
								}else this.quiz.contents[i].content.splice(j, 1);
							})
					if(this.quiz.contents[i].type === 3)
						await this.$sendFile(this.quiz.contents[i].audio, (e)=>{
							this.quiz.contents[i].audio = '';
						}, this.quiz.contents[i].content);
				}
				return true;
			},
			setDocument(e, content){
				let doc = e.target.files[0];
				doc.t = e.target.files[0].type.split('/')[0];
				if(!content.content) Vue.set(content, 'content', [])
				content.content.push({precontent: URL.createObjectURL(doc), blob: doc, type: this.$functions.getFileType(doc.t), size: doc.size, name: doc.name});
			},
			setGalery(e, content){
				let blob = e.target.files[0];
				blob.t = e.target.files[0].type.split('/')[0];
				if(!content.content) Vue.set(content, 'content', [])
				content.content.push({type: this.$functions.getFileType(blob.t), precontent: URL.createObjectURL(blob), blob: blob});;
			},
			validateHw(){
				if(this.$functions.validateInput(this.quiz, 'name')) return false;
				if(this.$functions.validateInput(this.quiz, 'level')) return false;
				let err = false;
				for(let i = 0; i < this.quiz.contents.length; i++){
					let quiz = this.quiz.contents[i];
					if(quiz.type === 2){
						if(this.$functions.validateInput(quiz.content, 'question')) 	return false;
						if(this.$functions.validateInput(quiz.content, 'answers', 2)) return false;
						if(this.$functions.validateInput(quiz.content, 'correct')) 		return false;
						for(let j = 0; j < quiz.content.answers.length; j++){
							this.$functions.validateInput(quiz.content.answers[j], 'answer')
							if(quiz.content.answers[j].answer_err == true && err == false) err = true;
						}
					}else if(quiz.type === 4 || quiz.type === 5){
						if(this.$functions.validateInput(quiz, 'content')) return false;
					}else if(quiz.type == 1){
						if(this.$functions.validateInput(quiz, 'content', 5)) return false;
					}else if(quiz.type == 3){
						if(this.$functions.validateInput(quiz, 'content')) return false;
					}
				}
				if(err) return false;
				else    return true;
			},
			deleteBlock(index){
				this.quiz.contents.splice(index, 1)
			},
			swapContent(type, index){
				if(!type){
					this.quiz.contents.splice(index + 2, 0, this.quiz.contents[index])
					this.quiz.contents.splice(index, 1)
				}
				else{
					this.quiz.contents.splice(index - 1, 0, this.quiz.contents[index])
					this.quiz.contents.splice(index + 1, 1)
				}
			},
			takeType(e, id, content, index){
				if(content) this.trash = true;
				e.preventDefault();
				let p = e.target;
				let drag = p.cloneNode(true);
				if(index !== undefined) this.quiz.contents.splice(index, 1);
				drag.style.transition = '0s';
				drag.style.position = 'absolute';
				if(!content){
					drag.style.transform = 'scale(1.05, 1)';
					drag.style.backgroundColor = '#1f83d4';
					drag.style.color = '#fff';
				}else{
					drag.style.opacity = '0.8';
					for (let i = 0; i < drag.children.length; i++){
						if(drag.children[i].classList.value === 'iteration' || drag.children[i].classList.value === 'delete-droped-block svg-inline--fa fa-trash-alt fa-w-14'){
							drag.removeChild(drag.children[i])
							i--;
						}
					}
					drag.style.width = 'calc(100% - 503px)';
					drag.style.backgroundColor = '#fff';
				}
				drag.style.borderColor = '#1f83d4';
				drag.style.fontWeight = '450';
				let x = e.offsetX;
				let y = e.offsetY;
				drag.style.left = e.pageX - x + 'px';
				drag.style.top = e.pageY - y + 'px';
				let child = undefined, glReverse = undefined;
				document.onmousemove =  ev => {
					drag.style.left = ev.pageX - x  + 'px';
					drag.style.top = ev.pageY - y + 'px';
					let j = undefined, reverse = undefined;
					for(let i = 0; i < this.$refs['body'].children.length; i++){
						let s = this.$refs['body'].children[i].getBoundingClientRect();
						if(ev.pageX < s.right && ev.pageX > s.left)
							if(ev.pageY >= s.bottom){
								this.$refs['body'].children[i].style.paddingTop = '10px';
								this.$refs['body'].children[i].style.paddingBottom = '10px';
							}
							else if(j === undefined){
									j = i;
									if(ev.pageY >= s.bottom - (s.height / 2))
										reverse = true;
								}else{
									this.$refs['body'].children[i].style.paddingTop = '10px';
									this.$refs['body'].children[i].style.paddingBottom = '10px';
								}
					}
					let size = this.$refs['body'].getBoundingClientRect();

					if(size.right && ev.pageX > size.right && content){
						this.$refs['trash'].classList.add('hover')
						for(let i = 0; i < this.$refs['trash'].children[0].children.length; i++)
							this.$refs['trash'].children[0].children[i].classList.add('hover')
					}else if(size.right && ev.pageX < size.right && content){
						this.$refs['trash'].classList.remove('hover')
						for(let i = 0; i < this.$refs['trash'].children[0].children.length; i++)
							this.$refs['trash'].children[0].children[i].classList.remove('hover')
					}

					if(j !== undefined){
						child = this.$refs['body'].children[j];
						if(reverse){
							glReverse = true;
							child.style.paddingBottom = '50px';
							child.style.paddingTop = '10px';
						}
						else{
							glReverse = false;
							child.style.paddingTop = '50px';
							child.style.paddingBottom = '10px';
						}
					}
				}
				if(!content) 
					document.onmouseup = ev => {
						document.body.removeChild(drag);
						this.quiz.contents.push({type: id, content: id === 2 ? {answers: [{answer: ''},{answer: ''}], question: ''} : id === 4 || id === 5 ? [] : ''});
						setTimeout(()=>{this.$refs['zone'].scrollTo({top: this.$refs['zone'].scrollHeight, behavior: "smooth"});},0)
						clearTimeout(inter)
						this.popup = false;
						document.onmousemove = () => {};
						document.onmouseup = () => {};
					}
				let inter = setTimeout(()=>{
					document.onmouseup = ev => {
						if(child){
							child.style.transition = '0s';
							child.style.paddingTop = '10px';
							child.style.paddingBottom = '10px';
							child.style.transition = '0.3s';
						}
						let size = this.$refs['body'].getBoundingClientRect();
						if(ev.pageX < size.right){
							let chance = true;
							for(let i = 0; i < this.$refs['body'].children.length; i++){
								let s = this.$refs['body'].children[i].getBoundingClientRect();
								if(ev.pageY < s.bottom){
									chance = false;
									if(!content)
									this.quiz.contents.splice(glReverse ? i + 1 : i, 0, {type: id, content: id === 2 ? {answers: [{answer: ''},{answer: ''}], question: ''} : id === 4 || id === 5 ? [] : ''});
									else
										this.quiz.contents.splice(glReverse ? i + 1 : i, 0, content)
									break;
								}
							}
							if(chance)
								if(!content)
									this.quiz.contents.splice(0, 0, {type: id, content: id === 2 ? {answers: [{answer: ''},{answer: ''}], question: ''} : id === 4 || id === 5 ? [] : ''});
								else
									this.quiz.contents.splice(index ? index : 0, 0, content)
						}

						if(content && ev.pageX > size.right){
							drag.style.right = '-70px';
							drag.style.left = '';
							drag.style.top = '';
							drag.style.transition = '0.3s';
							drag.classList.add('go_to_trash')
							setTimeout(()=> {
								document.body.removeChild(drag)
								this.trash = false;
								// this.$refs['trash'].classList.remove('hover');
								// for(let i = 0; i < this.$refs['trash'].children[0].children.length; i++)
								// 	this.$refs['trash'].children[0].children[i].classList.remove('hover');
							}, 500)
						}else document.body.removeChild(drag);
						document.onmousemove = () => {};
						document.onmouseup = () => {};
					}
				},250)
				if(this.$mq.phone) clearTimeout(inter);
				document.body.appendChild(drag);
			},
			getHomework(id){
				this.loading = true;
				this.$http.post('/api', `method=GET-QUIZ&quiz_id=${id}`)
				.then( res => {
					this.quiz = res.data.quiz;
					if(!this.quiz.contents.length) this.quiz.contents = [{type: 1,content: ''},{type: 6,}];
				})
				.catch( err => {
					this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-QUIZ'})
				})
				.finally( () => this.loading = false )
			},
			getLevels(){
				this.$http.post('/api', `method=GET-LEVELS`)
				.then( res => this.levels = res.data.levels )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-LEVELS'}) )
			},
		}
	}
</script>

<style>
	@import url(../../assets/css/homeworks.css);
</style>