<template>
	<transition name="fade">
        <div class="content_chat" v-if="block_id > 18 && block_id < 25">
            <div class="block_chat" :class="{'zix': block_id > 18 && block_id < 25}">
                <div class="chat_tutorial">
                    <div class="search_messages">
                        <div class="companion">
                            <div class="photo"></div>
                            <div class="online">
                            <span class="name_in_up">Анвар Шер</span>
                            <span class="online_or_not">Онлайн</span>
                            </div>
                        </div>
                        <div class="search_block">
                            <input type="text" class="search_message_input">
                        </div>
                    </div>

                    <div class="chat_body">
                        <div class="messages" id="messages">
                            <div class="left_message">
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
                            </div>

                            <div class="left_message" v-if="block_id >= 20 && block_id < 25">
                                    <div class="photo in_messages_photo"></div>
                                <div class="w-60">
                                    <p class="name_in_message">Анвар Шер</p>
                                    <div class="left_message_content">
                                        <span class="message_text">Расскажите о себе в аудиозаписи</span>
                                        <span class="readed">Прочитано</span>
                                    </div>
                                </div>
                                <div class="message_time">
                                    <img :src="$tutorialUrl+'images/images.png'" class="resend" title="Ответить на сообщение">
                                </div>
                            </div>

                            <div class="right_message" v-if="block_id >= 22 && block_id < 25">
                                <div class="message_time">
                                    <img :src="$tutorialUrl+'images/images.png'" class="resend" title="Ответить на сообщение">
                                </div>
                                <div class="w-60">
                                    <p class="name_in_message_right">Асылжан Мухтаров</p>
                                    <div class="right_message_content">
                                        <div class="audio">
                                            <div class="voicePlay"><img :src="$tutorialUrl+'images/play.png'" class="playPause"></div>
                                            <p class="audio_time">{{intMinute  + ':' + intSeconds}}</p>
                                            <div class="lengthAudio">
                                                <div class="duration"></div>
                                            </div>
                                        </div>
                                        <span class="readed">Прочитано</span>
                                    </div>
                                </div>
                                <div class="photo right_messages_photo"></div>
                            </div>

                            <div class="left_message" v-if="block_id > 23 && block_id < 25">
                                    <div class="photo in_messages_photo"></div>
                                <div class="w-60">
                                    <p class="name_in_message">Анвар Шер</p>
                                    <div class="left_message_content">
                                        <span class="message_text">У вас новый тест, чтобы увидеть задание нажмите на картинку</span>
                                        <a @click="plusId()" class="test_link"><img :src="$tutorialUrl+'images/Quiz.png'"></a>
                                        <span class="readed">Прочитано</span>
                                    </div>
                                </div>
                                <div class="message_time">
                                    <img :src="$tutorialUrl+'images/images.png'" class="resend" title="Ответить на сообщение">
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="resend_div">
                        
                    </div>
                    <div class="message_send">
                        <img :src="$tutorialUrl+'images/if_clip_1814096.png'" class="screpka" onclick="addFile()" title="Прикрепить файл">

                        <div class="record_audio" v-show="record">
                            <div class="first_audio_div">
                                <div class="record_div">
                                    <div class="square"></div>
                                </div>
                            <span id="timer_audio" ref="span" class="timer_audio">00:00</span>
                            </div>
                            <div class="second_audio_div" @click="stopAudio">
                                <img :src="$tutorialUrl+'images/x-men.png'" class="stop_audio">
                            </div>
                        </div>

                        <textarea type="text" ref="message_text" class="message_input non_scroll" placeholder="Введите сообщение" @keyup="checkEnter" id="message_input"></textarea>
                        <img :src="$tutorialUrl+'images/b2l1.png'" class="voice" id="voice" title="Голосовое сообщение" @click="recVoice()">
                        <img :src="$tutorialUrl+'images/if_Sed-09_2236081.png'" class="send_button" title="Отправить сообщение" id="send" @click="sendMessage()">
                    </div>
                    <div class="added_files" id="added_files">
                        <div class="add_document">
                            <span class="document_name"><img :src="$tutorialUrl+'images/Doc_icon.png'" class="doc_icon"><span>Найти ошибки.docx <br> 12kb </span></span>    
                            <img :src="$tutorialUrl+'images/x.png'" onclick="closeFile()" height="15">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
	name: 'profile',
	data () {
		return {
        	seconds: 0, minute: 0, interval: '', intSeconds: 0, intMinute: 0,
        	record: false, myMessage: ''
		}
	},
	methods:{
		sendMessage(){
	        if(this.block_id == 19 && this.$refs.message_text.value != ''){
	            this.myMessage = this.$refs.message_text.value;
	            this.plusId();
	            this.$refs.message_text.value = '';
	        }
	        else if(this.block_id == 21){
	            this.record = false;
	            this.$refs.message_text.placeholder = 'Введите сообщение';
	            this.$refs.span.innerHTML = '00:00';
	            clearInterval(this.interval);
	            this.plusId();
	        }
	    },
	    recVoice(){
	        if(this.block_id == 20){
	            self = this;
	            this.record = true;
	            this.$refs.message_text.placeholder = '';
	            this.interval = setInterval(function(){
	                self.seconds++;
	                if(self.seconds >= 60) {self.minute++; self.seconds = 0}
	                if(self.seconds < 10) self.intSeconds = '0' + self.seconds;
	                else self.intSeconds = self.seconds;
	                if(self.minute < 10) self.intMinute = '0' + self.minute;
	                else self.intMinute = self.minute
	                self.$refs.span.innerHTML = self.intMinute +  ':' + self.intSeconds;
	            }, 1000);

	            setTimeout(function(){
	                self.plusId();
	            }, 500);
	        }
	    },
	    stopAudio(){
	        this.minute = 0;
	        this.seconds = 0;
	        this.record = false;
	        this.$refs.message_text.placeholder = 'Введите сообщение';
	        self.$refs.span.innerHTML = '00:00';
	        clearInterval(this.interval);
	        this.minusId();
	    },
        checkEnter(e){
          if(e.keyCode == 13) 
          {
            if(e.ctrlKey) this.text += '\n';
            else this.sendMessage();
          }
        },
        plusId() {
            this.$emit('plusId')    
        },
        minusId() {
            this.$emit('minusId')    
        }
	},
	props: ['block_id']
}
</script>
<style>
  @import url(../../../assets/tutorial_styles/chat.css);
</style>