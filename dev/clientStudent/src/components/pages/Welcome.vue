<template>
	<div class="content_chat">
		<div class="block_chat zix">
			<div class="chat_tutorial">
				<div class="search_messages">
					<div class="companion">
						<div class="photo">
						</div>
						<div class="online">
							<span class="name_in_up">Smartchat Teacher</span>
							<span class="online_or_not">Онлайн</span>
						</div>
					</div>
<!-- 					<div class="search_block">
						<input type="text" class="search_message_input">
					</div> -->
				</div>
				<div class="chat_body">
					<div class="messages" id="messages">

						<div v-for="m in messages" :class="{ 'left_message': !m.pos, 'right_message' : m.pos }" >
							<img src="/static/img/avatar.jpg" class="photo-welcome">
							<div class="w-60">
								<p :class="m.pos ? 'name_in_message_right' : 'name_in_message' ">{{m.senderName}}</p>
								<div :class="m.pos ? 'right_message_content' : 'left_message_content'">
									<span :class="m.pos ? 'right_message_text' : 'message_text'">{{m.text}}</span>
									<span class="time_sended">{{m.time}}</span>
								</div>
							</div>
							<div class="message_time">
								<!-- <img :src="$tutorialUrl+'images/images.png'" class="resend" title="Ответить на сообщение"> -->
							</div>
						</div>
						<!-- <div class="left_message">
								<div class="photo in_messages_photo"></div>
							<div class="w-60">
								<p class="name_in_message">Анвар Шер</p>
								<div class="left_message_content">
									<span class="message_text">Здравствуйте. Я ваш преподаватель</span>
									<span class="readed">Прочитано</span>
								</div>
							</div>
							<div class="message_time">
								<img :src="$tutorialUrl+'images/images.png'" class="resend" title="Ответить на сообщение">
							</div>
						</div>

						<div class="right_message" v-if="block_id >= 20 && block_id < 25">
							<div class="message_time">
								<img :src="$tutorialUrl+'images/images.png'" class="resend" title="Ответить на сообщение">
							</div>
							<div class="w-60">
								<p class="name_in_message_right">Асылжан Мухтаров</p>
								<div class="right_message_content">
									<span class="right_message_text">{{myMessage}}</span>
									<span class="readed">Прочитано</span>
								</div>
							</div>
							<div class="photo right_messages_photo"></div>
						</div> -->

						

					</div>
				</div>
				<div class="resend_div"></div>
				<div class="message_send">
					<img src="/static/img/if_clip_1814096.png" class="screpka" title="Прикрепить файл">
					<!-- <div class="record_audio" v-show="record">
						<div class="first_audio_div">
							<div class="record_div">
								<div class="square"></div>
							</div>
						<span id="timer_audio" ref="span" class="timer_audio">00:00</span>
						</div>
						<div class="second_audio_div" @click="stopAudio">
							<img :src="$tutorialUrl+'images/x-men.png'" class="stop_audio">
						</div>
					</div> -->

					<textarea type="text" v-model='text_message' ref="message_text" autofocus class="message_input non_scroll" placeholder="Введите сообщение" @keyup="checkEnter" id="message_input"></textarea>
					<!-- <img :src="$tutorialUrl+'images/b2l1.png'" class="voice" id="voice" title="Голосовое сообщение" @click="recVoice()"> -->
					<img src="/static/img/if_Sed-09_2236081.png" class="send_button" title="Отправить сообщение" id="send" @click="sendMessage()">
				</div>
				<div class="added_files" id="added_files">
					<!-- <div class="add_document"> -->
						<!-- <span class="document_name"><img :src="$tutorialUrl+'images/Doc_icon.png'" class="doc_icon"><span>Найти ошибки.docx <br> 12kb </span></span>     -->
						<!-- <img :src="$tutorialUrl+'images/x.png'" onclick="closeFile()" height="15"> -->
					<!-- </div> -->
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'Welcome',
	components:{
	},
	data () {
		return {
			messages: [
			{senderName: 'Teacher', text: 'Здравствуйте', pos: 0, time: '11:00'}
			],
			counter: 0,
			text_message: '',
			time: ''
		}
	},
	mounted() {

	},
	methods: {
		sendMessage() {
			if(this.text_message == ''){
				return;
			}else{
				let date = new Date();
				this.time = date.getHours() + ':' + date.getMinutes();
				this.messages.push({senderName: 'Student', text: this.text_message, pos: 2, time: this.time});
				this.text_message = '';
			}
		},
		checkEnter(event){
			if(event.keyCode == 13){
				if(event.ctrlKey) this.text_message += '\n';
        		else this.sendMessage();
			}
		},
		addMessage(text, pos) {
			if(pos) {

			} else {

			}
		}
	},
}
</script>
<style type="text/css" scoped>
  @import url(../../assets/tutorial_styles/chat.css) (min-width: 768px);
  @import url(../../assets/styles/pages/mobile/chat.css) (max-width: 768px);
</style>