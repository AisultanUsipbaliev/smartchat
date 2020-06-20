<template>
	<div>
		<div :class="{'content-chat' : $mq.phone && !messagesDiv, 'full-content' : $mq.phone && messagesDiv, 
		'closed-sidebar' : !$mq.phone && !state && !fullChat, 'content' : !$mq.phone && state && !fullChat, 'fullscreen' : !$mq.phone && fullChat  }" v-viewer="{movable: false}" >
			<div :class="$mq.phone ? 'chat_mobile' : 'chat_web'">
				<div :class="$mq.phone ? 'mobile-chat' : 'web-chat'">
					<div :class="{'mob-dialog-list' : $mq.phone, 'web-dialog-list' : !$mq.phone && dialogsShow, 'zero-width' : !dialogsShow }">
						<div class="web-dialog-list-head">
							<input type="search" class="web-dialog-list-search" placeholder="Поиск по диалогам" @keyup="searchChats()" v-model="search.chats" v-if="false">
							<span v-else>Группы</span>
						</div>
						<div class="web-dialog-list-body">
							<div class="nothing-content" v-if="nopeChat && $mq.phone">У вас нет ни одного чата</div>
							<div :class="current_chat == student.group_id ? 'web-list-active' : ''" class="web-chat-student-list" v-for="(student, i) in students" 
									 @click="changeChat(student.group_id, i)">
								<img :src="student.student && student.student.ava ? $functions.checkAva(student.student.ava) ? student.student.ava 
																																																						 : $photoUrl + student.student.ava 
																																  : '/static/img/avatar.jpg'" 
								class="web-list-photo">
								<div class="web-student-list">
									<span class="web-name-dialog-list">{{student.group_name}}<div class="web-online-student" v-if="student.status"></div></span>
									<span class="web-last-message">
										{{student.writing ? student.writing 
																			: student.lastMessage.mes_id ? student.lastMessage.isteacher ? '' 
																																																	 : student.lastMessage.sender_name + ': ' 
																																	 : ''}} 
										{{student.lastMessage && !student.writing ? student.lastMessage.type != 1 ? $functions.getNameOfFile(student.lastMessage.type) : student.lastMessage.content : ''}}
									</span>
								</div>
								<fai v-if="student.islesson && !student.newMes" icon="clock" class="o-clock" :title="'У студента ' + student.group_name + ' занятие' "/>
								<span class="new_mess" v-if="student.newMes">{{student.newMes < 100 ? student.newMes : '99+'}}</span>
							</div>

						</div>
					</div>
					<div :class="{'mob-messages' : $mq.phone && !messagesDiv, 'web-messages' : !$mq.phone && dialogsShow, 'mob-open-messages' : $mq.phone && messagesDiv, 
					'full-web-messages' : !$mq.phone && !dialogsShow && !templatesBlock, 'medium-web-messages' : !$mq.phone && !dialogsShow && templatesBlock, 
					'short-web-messages' : !$mq.phone && dialogsShow && templatesBlock,}" @touchend="(event)=>{event.stopPropagation()}">
						<div class="web-messages-head">
							<div class="web-info-user">
								<div class="web-close-dialog-block" v-if="!$mq.phone && current_student.group_id" :title="dialogsShow ? 'Скрыть список' : 'Показать список'" @click="dialogsShow = !dialogsShow">
									<img src="/static/img/down.png" :class="dialogsShow ? 'web-close-dialog-list' : 'web-reverse-dialog-list' " id="dialogClose">
								</div>
								<div class="web-close-dialog-block" v-if="$mq.phone" @click="closeChat()">
									<img src="/static/img/down.png" class="web-close-dialog-list" id="dialogClose">
								</div>
								<div class="web-photo-user">
									<img :src="current_student.student && current_student.student.ava ? 
																																				$functions.checkAva(current_student.student.ava) ? current_student.student.ava 
																																																						 : $photoUrl + current_student.student.ava 
																																										: '/static/img/avatar.jpg'" 
									class="web-dialog-photo" v-if="current_student.group_id">
								</div>
								<div class="web-info-user-text" v-if="current_student.group_id">
									<span class="web-name-dialog">{{current_student.group_name}}</span>
									<span class="web-online">{{current_student.writing ? current_student.writing : current_student.status ? 'Онлайн' : 'Не в сети'}}</span>
								</div>
							</div>
							<div class="web-search-messages">
								<span v-if="finding.length">
									<fai icon="chevron-up" @click="nextFinding(1)"/>
									<fai icon="chevron-down" @click="nextFinding(-1)"/>
									{{cur_find + 1}} / {{finding.length}}
								</span>
								<input type="text" v-if="!$mq.phone && current_student && current_student.group_id" @focus="focusing = false" @focusout="focusing = true" placeholder="Поиск сообщений" class="web-search-messages-input" @keyup="searchMessage()" v-model="search.mes">
								<img :src="fullChat ? '/static/img/unfull.png' : '/static/img/full.png'" v-if="!$mq.phone" class="web-fullscreen" :title="fullChat ? 'Обычный режим' : 'На полный экран'" @click="chatFull()">
							</div>
						</div>
						<div class="web-new-message web-new-message-activate" :style="{marginLeft: cur_date_message + 'px'}" v-show="cur_date && messages.length">{{cur_date}}</div>
						<div class="web-messages-body" ref="body" :style="{height: files.length ? 'calc(100% - 170px)' : 'calc(100% - 100px)'}">
							<div class="nothing-content" v-if="nopeChat">У вас нет ни одного чата</div>
							<div class="not-loading" v-if="messages.loading || !messages.length">
								<img src="/static/img/loop.gif" class="circle-loading" v-if="messages.loading">
								<span v-else>Чат пуст</span>
							</div>
							<div v-for="(message, i) in messages" :key="i" :style="resend === message ? {backgroundColor: '#1e83d40f'} : ''" v-if="!messages.loading">
								<div ref="days" class="web-new-message" v-if="message.prewDt"><span>{{$functions.getNormalDate(message.dt, true)}}</span></div>
								<div :class="message.isteacher ? 'web-right-message' : ''" class="web-message">
									<div class="web-body-photo">
										<img :src="message.ava ? $functions.checkAva(message.ava) ? message.ava 
																																							: $photoUrl + message.ava 
																					 : '/static/img/avatar.jpg'" 
										class="web-photo-message">
									</div>
									<div class="web-body-msg">
										<span class="web-body-name">{{message.sender_name}}</span>
										<div ref="mes" :id="'mes'+message.mes_id" :class="{'nobgc' : message.type == 3, 'web-body-content' : message.type != 3}">
											<div v-if="message.reference" class="reference_mes" @click="scrollToMes(message.reference)">
												<span class="senderName">{{message.refSender}}</span> <span class="senderContent"> {{message.refType !== 1 ? $functions.getNameOfFile(message.refType) : message.refContent}}</span></div>
											<p class="web-text-message">{{message.type == 1 ? message.content : message.type == 7 || message.type == 8 ? '' : message.title}}</p>
											<img :src="message.content ? $fileUrl + message.content : '/static/img/loop.gif'" view class="web-picture-content" v-if="message.type == 2">
											<audio-player :srcer="message.audio ? message.audio : $fileUrl + message.content" v-if="message.type == 3"></audio-player>
											<a class="web-document" v-if="message.type == 4" :href="$fileUrl + message.content" download>
												<img src="/static/img/doc_icon.png"  class="web-document-icon">
												<div class="web-info-document">	
													<span class="web-document-name">{{message.content_title}}</span>
													<!-- <span class="web-size-document">11.7 mb</span> -->
												</div>
											</a>
											<video controls :src="$fileUrl + message.content" v-if="message.type == 5" class="msg-video"></video>
											<router-link :to="message.type == 7 ? 'quiz?id=' + message.title : {name: 'AddTest', params: {id: message.title}}" v-if="message.type == 7 || message.type == 8">
												<div class="hw-message" @click="goOut = true">
													<span>{{message.content}}</span>
													<!-- :to="{name: message.type == 7 ? 'AddHomework' : 'AddTest', params:{id:message.title || 'new'}}"  -->
													<img :src="message.type == 7 ? 'static/img/Home_Work.png' : 'static/img/Quiz.png'">
												</div>
											</router-link>
											<span class="message_time" v-if="message.dt">{{$functions.checkOfNull(new Date(message.dt).getHours()) + ':' + $functions.checkOfNull(new Date(message.dt).getMinutes())}}</span>
											<div  class="message_time" v-else-if="message.retry" @click="retrySend()">Повторить</div>
											<div class="message_time" v-else>
												<img src="/static/img/clock.png" style="height: 15px">
											</div>
										</div>
									</div>
									<div class="web-resend-block">
										<img v-if="message.mes_id" :src="resend === message ? '/static/img/x.png' : '/static/img/resend.png'" :title="resend === message ? 'Отменить' : 'Ответить на сообщение'" class="web-resend-button" @click="resend == message ? resend = {} : resend = message">
									</div>
								</div>
							</div>
						</div>
						<div class="goDown" :class="{'goDown_active': goDown}" @click="goDownF()">
							<div v-if="newMes">
								<div class="new_count">{{newMes}}</div>
							</div>
							<fai icon="chevron-down"/>
						</div>
						<div class="web-added-files-block">
							<div v-for="(file, i) in files">
								<div class="added-huinia" v-if="file.image" @click="files.splice(i, 1)">
									<img :src="file.image" class="web-added-photo">
								 </div>
								<div class="web-added-document" v-else @click="files.splice(i, 1)">
									<img tool="Название дока" src="/static/img/document.png" class="web-added-doc">
									<span class="web-added-docname">{{file.name}}</span>
									<span class="web-size-document">{{$functions.getSize(file.size)}}</span>
								</div>
							</div>
						</div>
						<div class="web-messages-foot" v-if="current_student && current_student.group_id">
							<!-- <div class="web-down"><img src="/static/img/down.png" class="web-down-button"></div> -->
							<label for="files" v-if="!recording" ><svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="web-screpka" title="Прикрепить файл">
								<path fill="currentColor" d="M149.106 512c-33.076 0-66.153-12.59-91.333-37.771-50.364-50.361-50.364-132.305-.002-182.665L319.842 29.498c39.331-39.331 103.328-39.331 142.66 0 39.331 39.332 39.331 103.327 0 142.657l-222.63 222.626c-28.297 28.301-74.347 28.303-102.65 0-28.3-28.301-28.3-74.349 0-102.649l170.301-170.298c4.686-4.686 12.284-4.686 16.97 0l5.661 5.661c4.686 4.686 4.686 12.284 0 16.971l-170.3 170.297c-15.821 15.821-15.821 41.563.001 57.385 15.821 15.82 41.564 15.82 57.385 0l222.63-222.626c26.851-26.851 26.851-70.541 0-97.394-26.855-26.851-70.544-26.849-97.395 0L80.404 314.196c-37.882 37.882-37.882 99.519 0 137.401 37.884 37.881 99.523 37.882 137.404.001l217.743-217.739c4.686-4.686 12.284-4.686 16.97 0l5.661 5.661c4.686 4.686 4.686 12.284 0 16.971L240.44 474.229C215.26 499.41 182.183 512 149.106 512z" class=""></path>
							</svg></label>
							<audio-recorder v-if="recording" :chat="true" @audio-src="sendAudio" style="z-index: 10"></audio-recorder>
							<textarea ref="focus" :class="$mq.phone ? 'mob-message-input' : 'web-message-input'" placeholder="Введите сообщение" :autofocus="$mq.phone ? false : true" v-model="message_text" @keydown="checkEnter" v-else></textarea>
							<fai icon="book" title="Шаблоны" class="web-template-button" @click="templatesBlock = !templatesBlock" v-if="!recording"/>
							<fai icon="microphone-alt" class="web-send-voice" title="Голосовое сообщение" v-if="!recording && !message_text.length && !files.length" @click="recording = true"/>
							<img src="/static/img/send.png" class="web-send-button" title="Отправить" @click="sendMessage()" v-else>
						</div>
					</div>
					<div :class="{'darkPop' : $mq.phone && templatesBlock}">
						<div :class="$mq.phone ? 'mob-templates-block' : 'web-templates-block'" v-if="templatesBlock">
							<div class="web-templates-head" v-if="!template_status">
								<div v-if="!searchingT" :class=" current_template == i ? 'web-active-fai' : ''" class="web-fai" v-for="(icon, i) in templates_icon" 
										 @click="swapTemplate(i)">
									<fai :icon="icon"/>
								</div>
								<input type="text" class="web-dialog-list-search" v-model="search_templates" placeholder="Поиск" v-if="searchingT">
								<div v-if="searchingT" class="web-fai-search" title="Закрыть поиск" @click="searchingT = false, search_templates = '' ">
									<fai icon="times" v-if="searchingT"/>
								</div>
							</div>
							<div class="web-templates-body" id="web-templates-body">
								<div class="web-template" v-for="(template, t) in templates" v-if="templates.length">
										<div v-for="content in template.contents" v-if="current_template == 0">
											<span class="web-template-text" v-if="content.type ===  1">{{content.content}}</span>
											<img v-else-if="content.type === 2" :src="$fileUrl + content.content"  style="height: 100px">
											<div class="web-template-document" v-else>
												<img src="/static/img/doc_icon.png"  class="web-document-icon">
												<div class="web-info-document">	
													<span class="web-document-name">{{$functions.getFileTitle(content.content)}}</span>
													<!-- <span class="web-size-document">11.7 mb</span> -->
												</div>
											</div>
										</div>
									<p class="web-template-text">{{template.test_name}}{{template.name}}</p>
									<div class="web-send-template-block">
										<button class="web-send-template" @click="sendTemplate(template, t)">Отправить</button>
									</div>
								</div>
								<div class="web-template flex-template" v-if="!templates.length || templates.loading">
									<img src="/static/img/loop.gif" class="circle-loading" v-if="templates.loading">
									<span v-else>Ничего нет</span>
								</div>
							</div>
							<span class="close-templates-mob" v-if="$mq.phone" @click="templatesBlock = false">Закрыть</span>
						</div>
					</div>
					<input type="file" @change="uploadFile" id="files" style="display:none">
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
	name: 'Chat',
	components:{
		audioPlayer,
		audioRecorder,
	},
		data(){
		return{
			students: [],
			current_student: {status: 0},
			templates_icon:['book', 'tasks', 'home'],
			templates: [],
			current_template: 0,
			current_chat: 0,
			messages: {loading: true},
			chat_body: '',
			child: 0,
			cur_date: '',
			focusing: true,
			last_message: '',
			load: false,
			goDown: false,
			cur_date_message: 0,
			files: [],
			groups: [],
			messagesDiv: false,
			newMes: 0,
			goDown: false,
			resend: {},
			recording: false,
			search:{mes: '', chats: ''},
			finding: [],
			cur_find: 0,
			nopeChat: false,
			goOut: false,
			state: this.$store.getters['state/GET_STATE'].state,
			// Bauka magic
				message_text: '',
				template_status: false,
				search_templates: '', 
				searchingT: false,
				web_messages: 'width: calc(100% - 250px)',
				positionChat: 'left: 100%',
				chatMsg: false,
				mobTemp: false,
				templatesBlock: false,
				dialogsShow: true,
				sX: 0, eX: 0,
				fullChat: false
		}
	},
	computed: {
		getState() {
			return this.$store.getters['state/GET_STATE']
		},
		groupInfo(){
			let groups = this.$store.getters['groups/GET_ALL']
			this.groups = groups
			return groups
		},
		sw() {
			return this.$move;
		},
		newMesF(){
      return this.$store.getters['socket/DATA'];
    },
    writingF(){
      return this.$store.getters['socket/WRITING'];
    },
	},
	watch: {
		getState(newState) {
			this.state = newState.state
		},
		groupInfo: {
			handler : function (newData) {
				this.groups = newData
				for(let i=0; i<this.students.length; i++) 
					for(let j=0; j<this.groups.length; j++) {
						if(this.students[i].group_id == this.groups[j].groupId) {
							let student = this.students[i]
									student.status = this.groups[j].status
							this.$set(this.students, i, student)
						}
						if(this.current_student.group_id == this.groups[j].groupId) {
							this.$set(this.current_student, 'status', this.groups[j].status)
						}
					}
			},
			deep: true
		}, 
		newMesF(newData) {
			this.unshiftStudent(newData)
			if (!newData.data.isteacher && newData.data.group_id != this.current_student.group_id) this.$store.commit('notice/UNREAD_MESSAGE_INCREMENT');

      newData.data.sender_id = newData.data.sender;
      let dat2 = newData.data;
			if(newData.data.group_id == this.current_student.group_id){
	      if(!newData.data.isteacher){
					this.$socket.send(JSON.stringify({notice: 8, group_id: this.current_student.group_id}))
	        this.writing = '';
	        this.messages.push(newData.data);
	        this.$socket.send(JSON.stringify({notice: 8, group_id: this.current_student.group_id}))
	      }else{

	        let you = false;
					let local = localStorage.getItem(`messages_ ${dat2.group_id}`) ? localStorage.getItem(`messages_${dat2.group_id}`).split('-,-') : [];
					let p = [];
					for(let i = 0; i < local.length-1; i++)
						p.push(JSON.parse(local[i]));
					local = p;
					for(let i = 0; i < local.length-1; i++){
						if(local[i].content == dat2.content && local[i].title == dat2.title && local[i].reference == dat2.reference && local[i].type == dat2.type){
							local.splice(i, 1)
							break;
						}else if(dat2.prefiles == local[i].prefiles){
							local.splice(i, 1)
							break;
						}
					}
					let result = ''
					for(let i = 0; i < local.length; i++)
						result += JSON.stringify(local[i]) + '-,-';
					localStorage.setItem(`messages_${dat2.group_id}`, result)

	        for(let i = this.messages.length - 1; i >= 0; i--){
	          let dat1 = this.messages[i];
	          if(!dat1.mes_id){
	          	// console.log(dat1.content, '==', dat2.content, '&&', dat1.title, '==', dat2.title, '&&', dat1.reference, '==', dat2.reference, '&&', dat1.type, '==', dat2.type, '||', dat2.prefiles, '==', dat1.prefiles)
	            if((dat1.content == dat2.content && dat1.title == dat2.title && dat1.reference == dat2.reference && dat1.type == dat2.type) || (dat1.prefiles && dat2.prefiles == dat1.prefiles)){
	              you = true;
	              if(dat1.prefiles)Vue.set(this.messages[i], 'content', dat2.content)
	              Vue.set(this.messages[i], 'mes_id', dat2.mes_id)
	              Vue.set(this.messages[i], 'refSender', dat2.refSender)
	              Vue.set(this.messages[i], 'refType', dat2.refType)
	              Vue.set(this.messages[i], 'refContent', dat2.refContent)
	              Vue.set(this.messages[i], 'dt', dat2.dt)

	              if(this.messages[this.messages.length - 1].dt && this.messages[this.messages.length - 2].dt)
		        		if(this.$functions.getNormalDate(this.messages[this.messages.length - 1].dt, true) != this.$functions.getNormalDate(this.messages[this.messages.length - 2].dt, true)){
									Vue.set(this.messages[this.messages.length - 1], 'prewDt', true);
								}
	              break;
	            }
	          }
	        }
	        if (!you) this.getMyMes(newData)

	      }
        if(this.goDown){
          if(!dat2.isteacher)
            this.newMes++;
        }else setTimeout(()=>{this.chat_body.scrollTo({top: this.chat_body.scrollHeight, behavior: "smooth"});},100);
      }else{
	    	for(let i = 0; i < this.students.length; i++){
	    		if(newData.data.group_id == this.students[i].group_id){
			      if(!this.students[i].lastMessage) Vue.set(this.students[i], 'lastMessage', newData.data);
			      else this.students[i].lastMessage = newData.data;
			    	if(!newData.data.isteacher) {
			      	if(!this.students[i].newMes) {
				      	Vue.set(this.students[i], 'newMes', 1);
				      } else { 
				      	this.students[i].newMes++
				      }
				      break;
			      }
	    		}
	    	}
      }
    },
    writingF(newDate){
    	if(newDate.writing.group_id == this.current_student.group_id){
	      if(!this.current_student.writing) this.setDots(this.current_student, newDate.writing.dt);
	    }else{
	    	for(let i = 0; i < this.students.length; i++) {
	    		if(newDate.writing.group_id == this.students[i].group_id){
			      if(!this.students[i].writing)this.setDots(this.students[i], newDate.writing.dt);
			      break;
	    		}
	    	}
	    }
    }
	},
	created() {
		this.$store.dispatch('groups/GET_ALL')
	},
	mounted(){
		window.onkeydown = ()=>{
			if(this.focusing && this.$refs.focus){
      	this.$refs.focus.focus();
			}
    }
		this.$store.dispatch('groups/GET_ALL')
		this.getStudents();

		this.chat_body = this.$refs['body'];
		this.cur_date_message = (this.chat_body.clientWidth / 2 - 72.5);
		let inter = setInterval(()=>{
			if(this.cur_date_message != (this.chat_body.clientWidth / 2 - 72.5)) this.cur_date_message = (this.chat_body.clientWidth / 2 - 72.5);
			if(this.$route.name != 'Chat') clearInterval(inter);
		},100)
		this.chat_body.addEventListener('scroll', e => this.scrollBody());
	},
	beforeRouteLeave (to, from, next) {
		if(this.fullChat) {
			this.chatFull();
			window.onkeydown = () => {};
			next(true);
		}
		if(this.goOut && this.$mq.phone){
			window.onkeydown = () => {};
	    next(true)
		}else if(this.templatesBlock && this.$mq.phone){
	    next(false)
	  	this.templatesBlock = false;
	  }else if(this.messagesDiv && this.$mq.phone){
	    next(false)
	  	this.messagesDiv = false;
	  } else {
			window.onkeydown = () => {};
	    next(true)
	  }
	},
	methods:{
		retrySend(obj){
			obj.retry = false;
			this.$socket.send(JSON.stringify(obj));
		},
		chatFull(){
			let html = document.documentElement;
			this.fullChat = !this.fullChat;
			if(this.fullChat)   	this.$fscreen.requestFullscreen(html);
			else 									this.$fscreen.exitFullscreen()
		},
		unshiftStudent(newData) {
			for (let i = 1; i < this.students.length; i++) {
				if (this.students[i].group_id == newData.data.group_id) {
					let student = this.students[i];
					this.students.splice(i, 1)
					this.students.unshift(student)
				}
			}
		},
		closeChat(){
			this.current_student = {}; 
			this.current_chat = {};
			this.messagesDiv = false;
		},
		goDownF(){
			setTimeout(()=>{this.chat_body.scrollTo({top: this.chat_body.scrollHeight, behavior: "smooth"});},0);
			this.goDown = false;
			this.newMes = 0;
		},
		sendTemplate(template, i){
			if(template.temp_id){
				for(let i = 0; i < template.contents.length; i++) {
					let obj = {
            notice: 1,
            title: '',
            content: template.contents[i].content,
            type: template.contents[i].type,
            reference: 0,
            group_id: this.current_student.group_id,
            isteacher: true,
            sender_name: this.$store.getters['profile/DATA'].data.login + ' ' + this.$store.getters['profile/DATA'].data.lastname
          }
          this.pushBeforeSocket(obj);
				}
			}else if(template.id){
				let obj = {
          notice: 1,
          content: 'Задание: ' + template.name,
          title: template.id,
          type: 7,
          reference: 0,
          group_id: this.current_student.group_id,
          isteacher: true,
          sender_name: this.$store.getters['profile/DATA'].data.login + ' ' + this.$store.getters['profile/DATA'].data.lastname
        }
        this.$http.post('/api', `method=SEND-QUIZ&group_id=${obj.group_id}&quiz_id=${template.id}`)
				.then( res => {
					if(res.status === 200) {
	        	this.pushBeforeSocket(obj);
	        	this.templates.splice(i, 1);
					} else throw new Error(JSON.stringify(res))
				})
				.catch( err => {
					this.$swal({ type: 'error', title: 'Не удалось отправить задание!' })
					this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'SEND-QUIZ'}) 
				})
			}else if(template.test_id){
				let obj = {
          notice: 1,
          content: 'Тест: ' + template.test_name,
          title: template.test_id,
          type: 8,
          reference: 0,
          group_id: this.current_student.group_id,
          isteacher: true,
          sender_name: this.$store.getters['profile/DATA'].data.login + ' ' + this.$store.getters['profile/DATA'].data.lastname
        }
        this.$http.post('/api', `method=SEND-TEST&group_id=${obj.group_id}&test_id=${template.test_id}`)
				.then( res => {
					if(res.status === 200) {
        		this.pushBeforeSocket(obj);
	      		this.templates.splice(i, 1)
					} else throw new Error(JSON.stringify(res))
				})
				.catch( err => {
					this.$swal({ type: 'error', title: 'Не удалось отправить тест!' })
					this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'SEND-TEST'}) 
				})
			}
			if(this.$mq.phone) this.templatesBlock = false;
		},
		searchChats(){
			if(this.search.chats)
			this.$http.post('/api', `method=SEARCH-CHAT&text=${this.search.chats}`)
			.then( res => {
				if(res.status === 200) this.students = res.data.chats;
				else this.getStudents();
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'SEARCH-CHAT'}) )
			else this.getStudents();
		},
		searchMessage(){
			if(this.search.mes)
			this.$http.post('/api', `method=SEARCH-MESSAGE&text=${this.search.mes}&group_id=${this.current_student.group_id}`)
			.then( res => {
				this.finding = res.data.messages || [];
				this.cur_find = 0;
				if(this.finding.length) this.scrollToMes(this.finding[this.cur_find].mes_id)
			})
			.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'SEARCH-MESSAGE'}))
			else{
				this.finding = [];
				this.cur_find = 0; 
			}
		},
		nextFinding(a){
			this.cur_find += a;
			if(this.cur_find <= 0) this.cur_find = 0;
			else if(this.cur_find >= this.finding.length - 1) this.cur_find = this.finding.length - 1;
			this.scrollToMes(this.finding[this.cur_find].mes_id)
		},
		sendAudio(event){
			if(event.stop)
				this.recording = false;
			else if(this.current_student.group_id){
				let obj = {
	        notice: 1,
	        title: '',
	        content: event.name,
	        audio: event.audio,
	        type: 3,
	        reference: this.resend.mes_id ? this.resend.mes_id : 0,
	        group_id: this.current_student.group_id,
	        isteacher: true,
	        sender_name: this.$store.getters['profile/DATA'].data.login + ' ' + this.$store.getters['profile/DATA'].data.lastname
	      };
	      this.$sendFile(event.blob, (e)=>{
	      	this.pushBeforeSocket(obj);
	      }, event.name);
				this.recording = false;
	      this.resend = {};
	    }
		},
    setDots(obj, dateWrite){
			if(!obj.dateWrite)Vue.set(obj, 'dateWrite', dateWrite);
			else obj.dateWrite = dateWrite;
			if(!obj.writing)Vue.set(obj, 'writing', '');
      obj.writing = 'Печатает';
      let inerWriting = setInterval(()=>{
        obj.writing += '.';
      },500)
      setTimeout(()=>{
        clearInterval(inerWriting);
        let date = new Date().valueOf()
        if(date < dateWrite + 1500) this.setDots(obj, dateWrite)
        else obj.writing = '';
      },2000)
    },
    getMyMes(newData){
    	this.messages.push(newData.data);
      if(!this.goDown)setTimeout(()=>{this.chat_body.scrollTo({top: this.chat_body.scrollHeight, behavior: "smooth"});},0);
    },
		async sendMessage(){
		if(this.current_student.group_id) {
			if(this.recording == true){
				document.getElementById('sendRecord').click();
			}else if(this.files.length){
				let files = [];
				let text = this.message_text;
				let resend = Object.assign({}, this.resend);
        this.message_text = '';
        this.resend = {};
        let j = 0;
				for(let i = 0; i < this.files.length; i++){
					let obj = {
						// dt: (new Date().valueOf()),
            notice: 1,
            title: i === 0 ? text : '',
            prefiles: j + 1000,
            content_title: this.files[i].name,
            type: this.$functions.getFileType(this.files[i].blob.type),
            reference: i === 0 ? resend.mes_id ? resend.mes_id : 0 : 0,
            group_id: this.current_student.group_id,
            isteacher: true,
            sender_name: this.$store.getters['profile/DATA'].data.login + ' ' + this.$store.getters['profile/DATA'].data.lastname
          }
          this.pushBeforeSocket(obj, false)
          files.push(this.files[i])
          this.files.splice(i, 1);
          i--;
          j++;
				}
				j = 0;
				for(let i = 0; i < files.length; i++)
					await this.$sendFile(files[i].blob, res => {
						if(res.status === 200){
							let obj = {
								// dt: (new Date().valueOf()),
		            notice: 1,
		            title: i === 0 ? text : '',
		            prefiles: j + 1000,
		            content: res.data.name,
		            content_title: files[i].name,
		            type: this.$functions.getFileType(files[i].blob.type),
		            reference: i === 0 ? resend.mes_id ? resend.mes_id : 0 : 0,
		            group_id: this.current_student.group_id,
		            isteacher: true,
		            sender_name: this.$store.getters['profile/DATA'].data.login + ' ' + this.$store.getters['profile/DATA'].data.lastname
		          }
		          this.pushBeforeSocket(obj, true)
		        }
		        j++;
					})
			}else{
				if (this.message_text.trim().length>0) {
					let obj = {
						// dt: (new Date().valueOf()),
	          notice: 1,
	          content: this.message_text.trim(),
	          title: '',
	          type: 1,
	          reference: this.resend.mes_id ? this.resend.mes_id : 0,
	          group_id: this.current_student.group_id,
	          isteacher: true,
	          sender_name: this.$store.getters['profile/DATA'].data.login + ' ' + this.$store.getters['profile/DATA'].data.lastname
	        }
					this.pushBeforeSocket(obj)
	        this.message_text = '';
	        this.resend = {};
				}
      }
    }
		},
		scrollToMes(id){
      let mes = this.searchMesForResend(id);
      if(!mes) {
        this.downloadOldMes(id);
      }else{
	      mes = mes.offsetParent.offsetParent;
        this.chat_body.scrollTo({
          top: Math.abs(mes.offsetTop - 15),
          behavior: "smooth"
        });
        mes.classList.add('current_mes')
        mes.onmousemove = (e) => {
        	mes.classList.remove('current_mes')
        	mes.onmousemove = () => {};
        }
        mes.ontouchstart = (e) => {
        	mes.classList.remove('current_mes')
        	mes.ontouchstart = () => {};
        }
      }
    },
    searchMesForResend(id){
        for (let j = this.$refs['mes'].length - 1; j >= 0; j--){
          if(this.$refs['mes'][j].id == ('mes' + id))
            return this.$refs['mes'][j];
        }
    },
		uploadFile(e){
			this.files.push(e.target.files[0])
			if(e.target.files[0].type.split('/')[0] == 'image')
				Vue.set(this.files[this.files.length - 1], 'image', URL.createObjectURL(e.target.files[0]))
				Vue.set(this.files[this.files.length - 1], 'blob',e.target.files[0])
		},
		swapTemplate(i){
			this.current_template = i !== undefined ? i : this.current_template;
			this.templates = {};
			this.$set(this.templates, 'loading', true)
			switch(i){
				case 0: {
					this.$http.post('/api', `method=FIND-TEMPLATES&group_id=${this.current_student.group_id}`)
					.then( res => { this.templates = res.data.templates || [] })
					.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'FIND-TEMPLATES'}))
				};break;
				case 1: {
					this.$http.post('/api', `method=FIND-TEST&group_id=${this.current_student.group_id}`)
					.then( res => { this.templates = res.data.test || []	})
					.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'FIND-TEST'}))
				};break;
				case 2: {
					this.$http.post('/api', `method=FIND-QUIZ&group_id=${this.current_student.group_id}`)
					.then( res => {	this.templates = res.data.quiz || []	})
					.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'FIND-QUIZ'}))
				};break;
				case 3: this.searchingT = true; break;
			}
		},
		getStudents(){
			this.$http.post('/api', `method=GET-CHATS`)
			.then( res => {
				this.students = res.data.chats;

				let studentId = this.$store.getters['chat/DATA'].currentStudentId;
				if(!this.students.length) this.nopeChat = true;
				for(let i = 0; i < this.students.length; i++) {

					if (typeof studentId === 'number') {
						if(this.students[i].student.student_id == studentId) {
							this.changeChat(this.students[i].group_id, i);
							this.$store.dispatch('chat/RESET_STATE')
						}
					}

					for(let j=0; j<this.groups.length; j++) {
						if(this.students[i].group_id == this.groups[j].groupId) {
							this.students[i].status = this.groups[j].status
						}
					}
				}

				if(!this.$mq.phone && typeof studentId !== 'number' && this.students[0]) { 
					this.changeChat(this.students[0].group_id, 0)
				}

			})
			.catch(err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-CHATS'}))
		},
    scrollBody(){
    	if(this.$refs['days'])
      for(let i = this.$refs['days'].length - 1; i >= 0; i--){
        if(this.$refs['days'][i].offsetTop <= this.chat_body.scrollTop && this.child <= this.chat_body.scrollTop){
          if(this.child < this.$refs['days'][i].offsetTop)this.child = this.$refs['days'][i].offsetTop;
          this.cur_date = this.$refs['days'][i].children[0].innerHTML;
          break;
        }else {
          this.cur_date = '';
          if(this.$refs['days'][i-1])this.child = this.$refs['days'][i-1].offsetTop;
        }
        if(!this.$refs['days'].length) this.cur_date = '';
      }
      if(this.chat_body.scrollTop <= (this.chat_body.scrollHeight - this.chat_body.clientHeight - 500)) this.goDown = true;
      else this.goDown = false;
      if(this.chat_body.scrollTop <= 200 && this.load){
        this.load = false;
        this.downloadOldMes()
      }
    },
    pushBeforeSocket(obj, send) {
    	if(send === undefined || send === false){
	    	obj.ava = this.$store.getters['profile/DATA'].data.ava;
	    	this.messages.push(obj);
	    	localStorage.setItem(`messages_${this.current_student.group_id}`, localStorage.getItem(`messages_${this.current_student.group_id}`) + '-,-' + JSON.stringify(obj) + '-,-');
				if(!this.goDown)
					setTimeout(()=>{this.chat_body.scrollTo({top: this.chat_body.scrollHeight, behavior: "smooth"});},100);
			}
			if(send === undefined || send === true)this.$socket.send(JSON.stringify(obj));
			this.current_student.lastMessage = obj;
			this.unshiftStudent({data: { group_id: this.current_student.group_id}})
    },
		changeChat(id, index){
			this.messagesDiv = true;

			this.$store.commit('notice/UNREAD_MESSAGE_DECREMENT', this.students[index].newMes)

			this.students[index].newMes = 0;

			this.messages = {loading: true};

			this.current_student = this.students[index] || '';
			this.current_chat = id;
			this.load = false;
			this.cur_date = '';
			this.$http.post('/api', `method=GET-CHAT&group_id=${id}`)
			.then( res => {
				this.messages = res.data.messages || [];
				this.$socket.send(JSON.stringify({notice: 8, group_id: this.current_student.group_id}))
				if(res.data.messages){
					this.last_message = this.messages[0].mes_id;
					let local = localStorage.getItem(`messages_${id}`) ? localStorage.getItem(`messages_${id}`).split('-,-') : [];
					let p = []
					for(let i = 0; i < local.length; i++)	if(local[i]) p.push(JSON.parse(local[i]));
					local = p;
					for(let i = 0; i < this.messages.length; i++){
					if(local.length)
						for(let j = 0; j < local.length; j++){
							// console.log(local[j].content, '==', this.messages[i].content, '&&', local[j].title, '==', this.messages[i].title, '&&', local[j].reference, '==', this.messages[i].reference, '&&', local[j].type, '==', this.messages[i].type)
							if(local[j].content == this.messages[i].content && local[j].title == this.messages[i].title && local[j].reference == this.messages[i].reference && local[j].type == this.messages[i].type){
								local.splice(j, 1)
								break;
							}
						}
						if(this.messages[i-1]){
							if(this.$functions.getNormalDate(this.messages[i].dt, true) != this.$functions.getNormalDate(this.messages[i-1].dt, true)) 
								Vue.set(this.messages[i], 'prewDt', true);
						}else this.messages[i].prewDt = true;
						if(this.messages[i].type == 4){
							let pre = this.messages[i].content.split('-----v');
							pre.splice(pre.length - 2, 1)
							pre = pre.join('')
							Vue.set(this.messages[i], 'content_title', pre)
						}
					}
					let result = ''
					for(let i = 0; i < local.length; i++)
						result += JSON.stringify(local[i]) + '-,-';
					localStorage.setItem(`messages_${id}`, result)
				}
				let notSender = localStorage.getItem(`messages_${this.current_student.group_id}`) ? localStorage.getItem(`messages_${this.current_student.group_id}`).split('-,-') : [];
				for(let i = 0; i < notSender.length-1; i++){
					let obj = JSON.parse(notSender[i]);
					obj.retry = true;
					this.messages.push(obj)
				}
				this.load = true;
				let i = 0;
				let inter = setInterval(()=>{
					if(i >= 50) clearInterval(inter)
					if(this.chat_body.scrollHeight)
					this.chat_body.scrollTo({top: this.chat_body.scrollHeight})
					i++;
				},10)
				this.swapTemplate(this.current_template);
			})
			.catch(err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-CHAT'}))
		},
		downloadOldMes(){
			this.load = false;	
			this.$http.post('/api', `method=GET-CHAT&group_id=${this.current_chat}&mes_id=${this.last_message}`)
			.then( res => {
				if(res.data.messages){
					let scroll = this.chat_body.scrollHeight;
					this.messages[0].prewDt = false;
					let mas = [];
					for(let i = 0; i < res.data.messages.length; i++){
						if(res.data.messages[i+1]){
							if(this.$functions.getNormalDate(res.data.messages[i].dt, true) != this.$functions.getNormalDate(res.data.messages[i+1].dt, true)) res.data.messages[i].prewDt = true;
						}else res.data.messages[i].prewDt = true;
						if(res.data.messages[i].type == 4){
							let pre = res.data.messages[i].content.split('-----v');
							pre.splice(pre.length - 2, 1)
							pre = pre.join('')
							res.data.messages[i].content_title = pre;
						}
					this.messages.splice(0, 0, res.data.messages[i]);

					setTimeout(()=>{
						this.chat_body.scrollTo({top: Math.abs(scroll - this.chat_body.scrollHeight)});
						this.last_message = this.messages[0].mes_id;
						this.load = true;
					},0);
					}
				}
			})
			.catch(err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-CHAT'}))
		},
		// Bauka magic
			// mobile functions
				openChat(){
					let chat = document.getElementsByClassName('mob-chat-messages')[0];
					if(this.chatMsg){
						this.positionChat = 'left: 100%'
						setTimeout(()=>{
							chat.style.display = 'none';
						}, 300)
						this.chatMsg = false;
						this.$wiper.left = true;
						this.$wiper.right = true;
					}else{
						this.$wiper.left = false;
						this.$wiper.right = false;
						chat.style.display = 'block';
						setTimeout(()=>{
							this.positionChat = 'left: 0'
						}, 300)
						this.chatMsg = true;
					}
				},
				mobTemplates(){
					if(!this.mobTemp){
						this.mobChatBody = 'height: calc(100% - 350px)'
						setTimeout(()=>{
							this.templatesBlock = true
						}, 200)
						this.mobTemp = true;
					}else{
						this.templatesBlock = false
						setTimeout(()=>{
							this.mobChatBody = 'height: calc(100% - 100px)'
						}, 200)
						this.mobTemp = false;
					}
				},
			// web functions
				openTemplates(){
					this.swapTemplate(0)
					let template_block = document.getElementsByClassName('web-templates-block')[0];
					if(this.template_status){
						template_block.style.display = 'none';
						template_block.style.width = '0px';
						if(this.dialogsShow){
							this.web_messages = 'width: calc(100% - 250px)'	
						}else{
							this.web_messages = 'width: calc(100% - 0px)'	
						}
						this.template_status = false;
						this.searchingT = false;
					}else{
						template_block.style.width = '250px';
						if(this.dialogsShow){
							this.web_messages = 'width: calc(100% - 500px)';
						}else{
							this.web_messages = 'width: calc(100% - 250px)';
						}
						this.template_status = true;
						setTimeout(()=>{
							template_block.style.display = 'block';
						}, 200)
					}
				},
				toggleDialogList(){
					if(!$mq.phone){
						let dialogs = document.getElementById('dialogs');
						let arrow = document.getElementById('dialogClose');
						let web = document.getElementsByClassName('web-messages')[0];
						if(this.dialogsShow){
							dialogs.style.left = '-250px';
							web.style.left = 0;
							arrow.style.transform = "rotate(270deg)";
							if(this.template_status)
								this.web_messages = "width: calc(100% - 250px)"
							else
								this.web_messages = "width: calc(100% - 0px)"
							setTimeout(()=>{
								this.dialogsShow = false;
							},300)
						}else{
							this.dialogsShow = true;
							arrow.style.transform = "rotate(90deg)";
							if(this.template_status)
								this.web_messages = "width: calc(100% - 500px)"
							else
								this.web_messages = "width: calc(100% - 250px)"
							dialogs.style.left = '0px';
							web.style.left = '250px';
						}
					}
				},
				checkEnter(e){
					if(e.keyCode == 13){
						e.preventDefault();
		        if(e.ctrlKey) this.message_text += '\n';
		        else this.sendMessage();
		      }else
		        this.$socket.send(JSON.stringify({
		          notice: 11,
		          group_id: this.current_student.group_id,
		        }));
				},
	}
}
</script>
<style>
	@import url(../../assets/css/chat.css);
</style>