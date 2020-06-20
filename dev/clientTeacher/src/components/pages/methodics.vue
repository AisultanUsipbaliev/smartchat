<template>
	<div>
		<!-- <loading v-if="isLoading"></loading>	 -->
		<loading v-if="loading"></loading>	
		<input type="file" ref="file0" @change="setFile">
		<input type="file" ref="file1" accept="image/*, video/*"  @change="setFile">
		<div class="web-mt-new-method" title="Добавить" @click="newMethodic()"><fai icon="plus" /></div>
		<div class="web-add-methodic" v-show="addMethod" @touchend="offSwipe()" v-if="template">
			<div class="web-block-method-add">
				<img src="/static/img/close.png" class="close-add-method" @click="addMethodic()"/>
				<div class="web-add-method-title">
					<div class="web-add-method-head" @click="getFile(0)">
						<span>Прикрепить</span>
						<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" title="Прикрепить файл"><path fill="currentColor" d="M149.106 512c-33.076 0-66.153-12.59-91.333-37.771-50.364-50.361-50.364-132.305-.002-182.665L319.842 29.498c39.331-39.331 103.328-39.331 142.66 0 39.331 39.332 39.331 103.327 0 142.657l-222.63 222.626c-28.297 28.301-74.347 28.303-102.65 0-28.3-28.301-28.3-74.349 0-102.649l170.301-170.298c4.686-4.686 12.284-4.686 16.97 0l5.661 5.661c4.686 4.686 4.686 12.284 0 16.971l-170.3 170.297c-15.821 15.821-15.821 41.563.001 57.385 15.821 15.82 41.564 15.82 57.385 0l222.63-222.626c26.851-26.851 26.851-70.541 0-97.394-26.855-26.851-70.544-26.849-97.395 0L80.404 314.196c-37.882 37.882-37.882 99.519 0 137.401 37.884 37.881 99.523 37.882 137.404.001l217.743-217.739c4.686-4.686 12.284-4.686 16.97 0l5.661 5.661c4.686 4.686 4.686 12.284 0 16.971L240.44 474.229C215.26 499.41 182.183 512 149.106 512z" class=""></path></svg>
					</div>
					<!-- <div class="web-add-method-head" @click="getRecord()">
						<span>Записать</span>
						<fai icon="microphone-alt"/>
					</div> -->
				</div>
				<div class="web-add-method-body">
					<textarea placeholder="Введите текст" class="text-add-method" v-model="template.texts[0].content"></textarea>
					<div class="imageblock-method">
						<div v-for="(media, q) in template.media">
							<div class="beforeclass" @click="removeMedia(q)">
								<img v-if="media.type == 2" :src="media.precontent ? media.precontent : $fileUrl + media.content" class="image-method">
								<video v-else controls :src="media.precontent ? media.precontent : $fileUrl + media.content" class="image-method"></video>
							</div>
						</div>
						<fai v-if="template.media && template.media.length" icon="plus" class="image-method" style="width: 40px !important; height: 120px !important" @click="getFile(1)"/>
					</div>

					<div class="audioblock-mt">
						<div v-for="(file, q) in template.files" class="flexim">
							<div v-if="file.type !== 3">
								<a download="true" class="document-block-homies" :title="file.name" :href="$fileUrl + file.content">
									<img src="/static/img/doc_icon.png" class="doc-icon">
									<div class="info-doc-added-hw">
										<span class="doci-name">{{file.name}}</span>
									</div>
								</a>
								<img src="/static/img/x.png" class="web-delete-button" @click="removeFiles(q)" v-if="!file.recorder">
							</div>
						</div>
					</div>

					<div class="audioblock-mt">
						<div v-for="(file, q) in template.files" class="flexim">
							<div v-if="file.type == 3 && !file.recorder">
								<audio-player :srcer="file.precontent ? file.precontent : $fileUrl + file.content"></audio-player>
								<img src="/static/img/x.png" class="web-delete-button" @click="removeFiles(q)" v-if="!file.recorder">
							</div>
						</div>
					</div>
				<div class="audioblock-mt">
						<div v-for="(file, q) in template.files" class="flexim">
							<div v-if="file.type == 3 && file.recorder">
								<audio-recorder :srcer="file.precontent ? file.precontent : file.content ? $fileUrl + file.content : ''" @audio-src="(e)=>sendAudio(e, file)"></audio-recorder>
								<img src="/static/img/x.png" class="web-delete-button" @click="removeFiles(q)">
							</div>
						</div>
					</div>
				</div>
				<div class="method-btn-block">
					<button class="btn-save-method" @click="saveTemplate()">{{!template.temp_id ? 'Создать' : 'Сохранить'}}</button>
				</div>
			</div>
		</div>
		<transition name="fade">
			<div class="confirm-delete" v-show="confirmDelete !== false">
				<div class="confirm-delete-homework">
					<span>Вы уверены что хотите удалить домашнее задание?</span>
					<button class="confirm-delete-btn" @click="deleteTemplate()">Удалить</button>
					<button class="confirm-btn" @click="confirmDelete = false">Отменить</button>
				</div>
			</div>
		</transition>
		<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
			<div :class="openMethod ? 'web-mt-list' : 'web-mt-closem' " >
					<div class="web-mt-title">
						<span class="web-metodica">Методика</span>
						<span class="web-mt-close" @click="openMethod = !openMethod">{{openMethod ? 'скрыть' : 'показать'}}</span>
					</div>
				<div class="web-mt-row">
					<span class="web-mt-name">Курс</span>
					<div class="web-mt-row-body">
						<span :class="i == current.rate ? 'web-mt-active' : ''" class="web-mt-type" v-for="(rate, i) in rates" :key="i" @click="getRate(rate.rate_id, i)">{{rate.rate_name}}</span>
					</div>
				</div>
				<div class="web-mt-row">
					<span class="web-mt-name">Уровень</span>
					<div class="web-mt-row-body">
						<span :class="level.lvl_id == current.level ? 'web-mt-active' : ''" class="web-mt-type" v-for="level in levels" @click="current.level = level.lvl_id">{{level.lvl_name}}</span>
					</div>
				</div>
				<div class="web-mt-row">
					<span class="web-mt-name">Урок</span>
					<div class="web-mt-row-body">
						<span :class="lesson == current.lesson ? 'web-mt-active' : ''" class="web-mt-type" v-for="lesson in rate.lessons" @click="current.lesson = lesson">{{lesson}}</span>
					</div>
				</div>
			</div>
			<div class="web-methodics" v-viewer="{movable: false}">
				<div class="nothing-content" v-if="!templates.length">Нет шаблонов на этот урок</div>
				<div class="web-methodic-row" :ref="`temp_${j}`" v-for="(template, j) in templates" :key="j">
					<div class="web-mt-numbers">
						<span class="hideCon" v-if="$mq.phone" style="font-size: 14px;" @click="toggleBox(j)">{{template.showBox ? 'Скрыть' : 'Показать'}}</span>
						<div class="no"></div>
						<fai icon="chevron-up" title="Вверх"  v-if="j != 0" @click="swapContent(1, j)"/>	
						<span class="web-mt-index">{{j+1}}</span>
						<fai icon="chevron-down" title="Вниз" v-if="j != templates.length - 1"  @click="swapContent(0, j)"/>	
					</div>
					<div class="web-mt-content" v-if="template.showBox">
						<div class="web-mt-mediacontent" @touchend="offSwipe()" v-if="template.media.length">
							<div v-for="media in template.media">
								<img  view :src="media.precontent ? media.precontent : $fileUrl + media.content" class="web-mt-imgcontent" v-if="media.type == 2">
								<video controls :src="media.precontent ? media.precontent : $fileUrl + media.content" class="web-mt-imgcontent" v-else></video>
							</div>
						</div>
						<div class="web-mt-audiocontent" @touchend="offSwipe()">
							<div v-for="file in template.files">
								<audio-player :srcer="file.precontent ? file.precontent : $fileUrl + file.content" v-if="file.type == 3"></audio-player>
								<div v-else>
									<div download="true" class="document-block-homies" :title="file.name" :href="$fileUrl + file.content">
										<img src="/static/img/doc_icon.png" class="doc-icon">
										<div class="info-doc-added-hw">
											<span class="doci-name">{{file.name}}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<p class="web-mt-text-content" v-for="text in template.texts">{{text.content}}</p>
					</div>
					<div class="web-mt-edit" v-if="template.showBox">
						<fai icon="pencil-alt" title="Редактировать" @click="redactTemplate(j)"/>
						<fai icon="trash-alt" title="Удалить" @click="confirmDelete = {id: template.temp_id, index: j}"/>
					</div>
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
	name: 'Methodics',
	components:{
		audioPlayer,
		audioRecorder,
	},
	data(){
		return{
			loading: false,
			listMt: 'height: auto',
			fullList: true,
			addMethod: false,
			rates: [],
			rate: {},
			levels: [],
			templates: [],
			files: [],
			template: {
				texts: [{}],
				media: [],
				files: []
			},
			changeIndex: null,
			current: {
				rate: 0,
				level: 1,
				lesson: 1,
			},
			confirmDelete: false,
			openMethod: true
		}
	},
	async mounted(){
		this.hideMethodContent();
		this.getTemplate();
		this.getRate(1, 0);
	},
	computed:{
		setLevel(){
			return this.current.level;
		},
		setLesson(){
			return this.current.lesson;
		}
	},
	watch:{
		setLevel(newData){
			this.getTemplates();
		},
		setLesson(newData){
			this.getTemplates();
		},
		['$mq.phone'](newData){
			if (!newData) 
				for (var i = 0; i < this.templates.length; i++) 
					this.templates[i].showBox = true
		}
	},
	methods:{
		sendAudio(event, content){
			Vue.set(content, 'blob', event.audio);
			Vue.set(content, 'precontent', URL.createObjectURL(event.audio));
		},
		getRecord(){
			this.template.files.push({type: 3, recorder: true})
		},
		getFile(index){
			this.$refs['file' + index].click();
		},
		setFile(e){
			let blob = e.target.files[0];
			blob.t = e.target.files[0].type.split('/')[0];
			if(blob.t == 'image') 			this.template.media.push({precontent: URL.createObjectURL(blob), type: 2, blob})
			else if(blob.t == 'video') 	this.template.media.push({precontent: URL.createObjectURL(blob), type: 5, blob})
			else if(blob.t == 'audio') 	this.template.files.push({precontent: URL.createObjectURL(blob), type: 3, blob})
			else												this.template.files.push({precontent: URL.createObjectURL(blob), type: 4, blob, name: blob.name})
		},
		async saveTemplate(){
			this.loading = true;
			await this.template.contents.splice(0, this.template.contents.length);
			await this.sendMedia('media');
			await this.sendMedia('files'); 
			await this.template.contents.push({content: this.template.texts[0].content, type: 1})
			if (this.template.contents.length>0) {
				let flag = false
				for (let i = 0; i < this.template.contents.length; i++) {
					if (this.template.contents[i].content) {
						if (this.template.contents[i].content.trim().length>0) {
						flag = true;
						break;
						}
					}
				}
				if (flag) {
					this.$http.post('/api', `method=${this.template.temp_id ? 'UPDATE-TEMPLATE&temp_id=' + this.template.temp_id : 'ADD-TEMPLATE'}&rate_id=${this.current.rate_id}&lesson=${this.current.lesson}&lvl_id=${this.current.level}&contents=${JSON.stringify(this.template.contents)}`)
					.then( res => {
						if(res.status === 200){
							Vue.set(this.template, 'showBox', true);
							let lastIndex = 0
							if(this.template.temp_id) {
								this.templates.splice(this.changeIndex, 1, this.template);
								lastIndex = this.changeIndex
							} else {
								this.template.temp_id = res.data.templateId;
								this.template.order = res.data.templateId;
								this.templates.push(this.template);
								lastIndex = this.templates.length-1;
							}
							setTimeout(()=> {
								this.$refs[`${'temp_' + lastIndex}`][0].scrollIntoView()
								this.$refs[`${'temp_' + lastIndex}`][0].classList.add('animate')
								setTimeout(()=> {
									this.$refs[`${'temp_' + lastIndex}`][0].classList.remove('animate')
								}, 2000)
							}, 0)
							this.addMethodic();
						}else console.warn(res);
					})
					.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: this.template.temp_id ? 'UPDATE-TEMPLATE' : 'ADD-TEMPLATE'}))
					.finally( () => this.loading = false )
				} else this.deleteTemp()
			} else this.deleteTemp()
		},
		deleteTemp() {
			if (this.template.temp_id) {
				this.$http.post('/api', `method=DELETE-TEMPLATE&temp_id=${this.template.temp_id}`)
				.then( res =>  this.templates.splice(this.changeIndex, 1) )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'DELETE-TEMPLATE'}) )
				.finally( () => {this.loading = false; this.addMethodic();} )
			} else {
				this.loading = false
				this.addMethodic();
			}
		},
		async sendMedia(key){
			for(let i = 0; i < this.template[key].length; i++)
				if(!this.template[key][i].content && this.template[key][i].blob){
						await this.$sendFile(this.template[key][i].blob, res => {
							if(res.status === 200){
								this.template.contents.push({content: res.data.name, type: this.template[key][i].type})
								Vue.set(this.template[key][i], 'content', res.data.name)
							}
						})
					}
				else this.template.contents.push({content: this.template[key][i].content, type: this.template[key][i].type})
			return true;
		},
		getTemplate(){
			this.$http.post('/api', `method=GET-RATES`)
			.then( res => {
				this.rates = res.data.rates;
				this.$http.post('/api', `method=GET-LEVELS`)
				.then( res => this.levels = res.data.levels )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-LEVELS'}) )
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-RATES'}) )
		},
		getRate(id, index){
			this.current.rate = index;
			this.current.lesson = 1;
			this.$http.post('/api', `method=GET-RATE&rate_id=${id}`)
			.then( res => {
				this.rate = res.data.rate;
				this.current.rate_id = id;
				this.getTemplates(id);
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-RATE'}))
		},
		getTemplates(id){
			id = id || this.current.rate_id;
			this.$http.post('/api', `method=GET-TEMPLATES&rate_id=${id}&lesson=${this.current.lesson}&lvl_id=${this.current.level}`)
			.then( res => {
				if(res.status === 200){
					for (let i = 0; i < res.data.templates.length; i++) res.data.templates[i].showBox = true;
					this.templates = res.data.templates;

					for(let i = 0; i < this.templates.length; i++)
						for(let j = 0; j < this.templates[i].contents.length; j++)
							if(this.templates[i].contents[j].type === 4){
								let pre = this.templates[i].contents[j].content.split('-----v');
								pre.splice(pre.length - 2, 1)
								pre = pre.join('')
								Vue.set(this.templates[i].contents[j], 'name', pre)
							}

					this.sortTemplate();
				}else if(res.status === 202)
					this.templates = [];
				else console.warn(res)
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-TEMPLATES'}))
		},
		sortTemplate(){
			for(let i = 0; i < this.templates.length; i++){
			Vue.set(this.templates[i], 'media', [])
			Vue.set(this.templates[i], 'files', [])
			Vue.set(this.templates[i], 'texts', [])
				for(let j = 0; j < this.templates[i].contents.length; j++){
					let type = this.templates[i].contents[j].type;
					if(type == 2 || type == 5)
						this.templates[i].media.push(this.templates[i].contents[j])
					else if(type == 3 || type == 4)
						this.templates[i].files.push(this.templates[i].contents[j])
					else 
						this.templates[i].texts.push(this.templates[i].contents[j])
				}
			}
		},
		redactTemplate(index){
			this.changeIndex = index;
			this.template = JSON.parse(JSON.stringify(this.templates[index]));
			this.addMethodic();
		},
		removeMedia(index){
			this.template.media.splice(index, 1)
		},
		removeFiles(index){
			this.template.files.splice(index, 1)
		},
		newMethodic(){
			this.template = {texts: [{}], media: [], files: [], contents: []};
			this.addMethodic();
		},
		swapContent(status, index){
			if(!status){
				this.$http.post('/api', `method=SWAP-TEMPLATES&first=${this.templates[index].temp_id}&second=${this.templates[index+1].temp_id}`)
				.then( res => {
					this.templates.splice(index + 2, 0, this.templates[index])
					this.templates.splice(index, 1)
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'SWAO-TEMPLATES'}) )
			}
			else{
				this.$http.post('/api', `method=SWAP-TEMPLATES&first=${this.templates[index].temp_id}&second=${this.templates[index-1].temp_id}`)
				.then( res => {
					this.templates.splice(index - 1, 0, this.templates[index])
					this.templates.splice(index + 1, 1)
				})
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'SWAO-TEMPLATES'}))
			}
		},
		deleteTemplate(){
			this.templates.splice(this.confirmDelete.index, 1)
			this.$http.post('/api', `method=DELETE-TEMPLATE&temp_id=${this.confirmDelete.id}`)
			.then( res => this.confirmDelete = false )
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'DELETE-TEMPLATE'}) )
		},
		toggleBox(index) {
			this.templates[index].showBox = !this.templates[index].showBox;
		},
		offSwipe(){
			event.stopPropagation();
		},
		hideMethodContent(){
			if(this.$mq.phone){
				let rows = document.querySelectorAll('.web-methodic-row');
				for (let i = 0; i < rows.length; i++) {
					rows[i].children[0].children[0].addEventListener('click', ()=>{
						if(rows[i].children[1].clientHeight == 0){
							rows[i].children[1].style.height = 'auto';
							rows[i].children[0].children[0].innerHTML = 'Скрыть'
						}else{
							rows[i].children[0].children[0].innerHTML = 'Показать'
							rows[i].children[1].style.height = '0';
						}

					})
				}
			}
		},
		addMethodic(){
			if(this.addMethod)				this.addMethod = false;
			else							this.addMethod = true;
		},
		offSwipe(){
			event.stopPropagation();
		},
	}
}
</script>
<style>
	@import url(../../assets/css/methodics.css)
</style>