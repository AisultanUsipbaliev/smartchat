<template>
  <div class="chat_content">
    <div class="nope_chat" v-if="!teacher"><span class="noTeacher">У вас нет чата!</span><img src="/static/img/starnight.jpg" class="noTeacherImg"></div>
    <div class="chat" v-if="teacher" v-dropper="{draganddrop: 'draganddrop', endF: sendFile}">
      <div :style="position_head" :class="{'search_messages_mobile':$mq.phone, 'search_messages': !$mq.phone}">
        <div :class="$mq.phone ? 'first_half_head': 'fhh'">
          <div v-if="$mq.phone" class="sidebar_button" id="sidebar_button" @click="sidebarToggle = !sidebarToggle">
            <div class="side_row" id="first_side"></div>
            <div class="side_row" id="second_side"></div>
            <div id="third_side" class="side_row"></div>
          </div>
          <div class="companion" v-if="teacher">
            <img class="photo in_messages_photo" :src="teacher.ava ? $photoUrl + teacher.ava : 'static/img/avatar.jpg'">
            <div class="online">
              <span class="name_in_up">{{teacher.firstname}} {{teacher.lastname}}</span>
              <span class="online_or_not">{{writing ? writing : teacherStatus? 'Онлайн': 'Не в сети'}}</span>
            </div>
          </div>
          <div class="search_block" v-if="!$mq.phone">
            <div class="arrow_block" v-if="search_text">
              <img src="/static/img/if_down_1167972.png" class="search_arrow arrow__top" @click="nextSearch(true)">
              <img src="/static/img/if_down_1167972.png" class="search_arrow arrow__bottom" @click="nextSearch(false)">
            </div>
            <span class="search_count" v-if="search_text">{{all_searching ? now_searching + 1 : 0}}/{{all_searching}}</span>
            <input type="text" @keydown="searchMes" @focus="focusing = false" @focusout="focusing = true" @change="searchMes" v-model="search_text" class="search_message_input" placeholder="Начните писать">
          </div>
          <img src="/static/img/search.png" class="head_search_btn" @click="position_head='margin-left: -100vw'" v-if="$mq.phone">
        </div>
        <div class="search_div_head" v-if="$mq.phone">
          <div class="arrow_block">
            <img src="/static/img/if_down_1167972.png" class="search_arrow arrow__top" @click="nextSearch(true)">
            <img src="/static/img/if_down_1167972.png" class="search_arrow arrow__bottom" @click="nextSearch(false)">
          </div>
          <span class="search_count">{{all_searching ? now_searching + 1 : 0}}/{{all_searching}}</span>
          <input placeholder="Начните писать" type="text" @focus="focusing = false" @keydown="searchMes" @change="searchMes" v-model="search_text" class="search_message_head_input">
          <img src="static/img/x.png" title="Отмена" @click="position_head='margin-left: 0', search_text = ''" class="close_head_input"/>
        </div>
      </div>
      <div id="draganddrop" class="draganddrop">
        <img src="static/img/filedrag.png" height="50">
        <p class="text_drag">Перетащите сюда документы, чтобы прекрепить их к сообщению</p>
      </div>
      <div class="chat_body" ref="chat_body" v-viewer="{movable: false}" :style="ChatBody_styles">
        <div class="messages" id="messages">
          <div v-for="(mes, mesIndex) in data.chat" :key="">
          <p class="new_message_time" ref="days" v-if="mes.prewDt">{{getDayMes(mes.dt)}}</p>
          <div :class="!mes.isteacher? mes.sender_id == my_id 
                                                            ? 'right_message' 
                                                            : 'left_message' 
                                     : 'left_message'"
                :style="mes.activ ? 'background-color: rgba(30,131,212,.1);' : ''"
                ref="mes" :id="'mes' + mes.mes_id">
              <img class="photo in_messages_photo" :src="mes.ava ? checkAva(mes.ava) ? mes.ava 
                                                                                     : $photoUrl + ''+ mes.ava 
                                                                 :'static/img/avatar.jpg' "
                   
                   >
            <div class="w-60">
              <p :class="!mes.isteacher ? mes.sender_id == my_id  
                                                               ? 'name_in_message_right' 
                                                               : 'name_in_message'
                                        : 'name_in_message'">
                {{mes.sender_name}}
              </p>
              <div :class="!mes.isteacher ? mes.sender_id == my_id  
                                                               ? 'right_message_content' 
                                                               : 'left_message_content'
                                        : 'left_message_content'">
                <div class="message_answer" v-if="mes.reference" @click="scrollToMes(mes.reference)">
                  <span class="name_reanswer">{{mes.refSender}}</span>
                  <span class="msg_reanswer">{{mes.refType != 1 ? mes.refTitle + ' ' +getNameByType(mes.refType) 
                                                             : mes.refContent}}
                                                           </span>
                </div>
                <span v-if="mes.type == 1 || mes.title" :class="!mes.isteacher ? mes.sender_id == my_id  
                                                               ? 'right_message_text' 
                                                               : 'message_text'
                                        : 'message_text'">{{mes.type != 1 ? mes.type == 8 || mes.type == 7 ? '': mes.title : mes.content}}
                </span>
                <img @click="openPicture('static/img/' + mes.content)" id="img1" v-if="mes.type == 2" view :src="$fileUrl + mes.content"  class="img_in_message">
                <audio-player :srcer="mes.mounted && mes.audio ? mes.audio : mes.content ? $fileUrl + mes.content : ''" v-if="mes.type == 3"></audio-player>
                <!-- <div class="audio-message" v-if="mes.type == 3">
                  <div class="voicePlay" @click="startNewAudio(mes.audio, mes.mes_id)">
                    <img :src="
                    mes.audio ? mes.audio.paused ? mes.preplay && 
                                                   !mes.audio.paused  && 
                                                   mes.audio.currentTime < 0.5 ? '/static/img/prog.gif'
                                                                             : 'static/img/play.png' 
                                                 : 'static/img/pause.png' 
                              : '/static/img/prog.gif'" 
                    class="playPause">
                  </div>
                  <p class="audio_time" v-if="mes.audio">{{mes.audio ? mes.audio.currentTime ? getTimeOnAudio(mes.audio.currentTime^0) : getTimeOnAudio(mes.audio.duration^0) : ''}}</p>
                  <div class="lengthAudio" @click="audioGoTo(mes.audio, $event)" >
                    <div class="duration":style="mes.audio ?{width: `calc(100% / ${mes.audio.duration} * ${mes.audio.currentTime})`}: ''"></div>
                  </div>
                </div> -->
                <a class="document" download :href="$fileUrl + '' + mes.content" v-if="mes.type == 4">
                  <fai icon="file" class="doc_icon"/>
                  <span class="document_name">{{mes.content}}</span>  
                </a>
                <video class="videocontent" v-if="mes.type == 5" controls :src="$fileUrl + mes.content"></video>
                <router-link v-if="mes.type == 7" :to="'/quiz?id='+ mes.title" class="home_link">{{'Задание: ' + mes.title}}<img src="/static/img/Home_Work.png"></router-link>
                <router-link v-if="mes.type == 8" :to="'/test?id=' + mes.title" class="test_link">{{'Тест: ' + mes.title}}<img src="/static/img/Quiz.png"></router-link>
                <span class="time_sended">{{new Date(mes.dt).getHours() < 10 ? '0' + new Date(mes.dt).getHours() : new Date(mes.dt).getHours()}}:{{new Date(mes.dt).getMinutes() < 10 ? '0' + new Date(mes.dt).getMinutes() : new Date(mes.dt).getMinutes()}}</span>
              </div>
            </div>
            <div class="message_time" :style="mes.not_original_dt ? 'color: #1e83d4' : ''">
              <!-- <span >{{new Date(mes.dt).getHours() < 10 ? '0' + new Date(mes.dt).getHours() : new Date(mes.dt).getHours()}}:{{new Date(mes.dt).getMinutes() < 10 ? '0' + new Date(mes.dt).getMinutes() : new Date(mes.dt).getMinutes()}}</span> -->
              <img src="static/img/images.png" @click="resendF(mes.sender_name, mes.type, mes.title, mes.content, mes.mes_id)" class="resend" title="Ответить на сообщение">
              <div class="readed_mes" v-if="!mes.isteacher && mes.sender_id == my_id && !mes.isread"></div>
            </div>
          </div>
          </div>
        </div>
      </div>  
      <div class="resend_div" v-if="resendDiv_showing" :style="resendDiv_styles">
        <div class="answer_on_input">
          <span>{{resend.name}}</span>
          <span v-if="resend.type == 1">{{resend.type != 1 ? resend.title : resend.content}}</span>
          <span v-if="resend.type == 2">Фотография</span>
          <span v-if="resend.type == 3">Аудио</span>
          <span v-if="resend.type == 4">Документ</span>
          <span v-if="resend.type == 5">Видеофайл</span>
          <span v-if="resend.type == 7">Домашнее задание</span>
          <span v-if="resend.type == 8">Тест</span>
        </div>
        <img src="static/img/x.png" title="Отмена" @click="closeResend()" class="resend"/>
      </div>
      <div class="message_send">
        <label :for="data.status == 200 || data.status == 205 ?'file' : ''"><img src="static/img/if_clip_1814096.png" class="screpka" title="Прикрепить файл"></label>
        <div class="record_audio" v-if="audio_input">
          <div class="record_div">
            <div class="square"></div>
          </div>
          <span id="timer_audio" class="timer_audio">{{getTimeOnAudio(micro)}}</span>
          <div class="second_audio_div" @click="stopRecord(false)">
            <img src="/static/img/x-men.png" class="stop_audio">
          </div>
        </div>
        <textarea ref="focus" @keydown="checkEnter" :disabled="!teacher ? true : false " type="text" class="message_input non_scroll" v-model="text" placeholder="Введите сообщение" id="message_input"></textarea>
        <img src="static/img/b2l1.png" class="voice" id="voice" title="Голосовое сообщение" v-if="text == '' && !files.length" @click="startRecord">
        <img src="static/img/if_Sed-09_2236081.png" class="send_button" title="Отправить сообщение" v-if="text || files.length" @click="data.status == 200 || data.status == 205 ? !audio_input ? sendMes() : stopRecord(true) : ''">
        <div class="bottom_down" @click="downChat" :style="goDown ? {bottom: '60px', opacity: '1'} : {bottom: '-600px', opacity: '0'}">
          <div class="msg_count" v-if="newMes">{{newMes}}</div>
          <div class="down_btn"><img src="/static/img/up_arrow.png" class="downToSmg"></div>
        </div>
      </div>
      <div class="added_files" id="added_files">
        <div class="add_document" v-for="(file, fileIndex) in files" :class="{'upload_file': file.uploadFile}" 
             @click="file.uploadFile ? closeFile(fileIndex) : ''">
          <img src="/static/img/prog.gif" class="doc_icon" v-if="file.uploadFile">
          <span class="document_name" v-if="!file.uploadFile">
            <fai :icon="file.typing == 2 ? 'image' : 'file'" class="doc_icon"/>
            <span class="info-add-document">
              <span v-line-clamp:20="1" class="doc-ellipsis">{{file.name}}</span>
              <span>{{file.sizeN}}</span>
            </span>
          </span>  
          <img src="static/img/x.png" @click="closeFile(fileIndex)" height="15">
        </div>
      </div>
    </div>
    <input type="file"  id="file" @change="sendFile" style="visibility: hidden; position: absolute; top: -200vh;">
  </div>
</template>

<script>
import Vue from 'vue'
import Recorder from 'recorder-js'
import AudioRecord from '@/components/partials/chat/audio_record'; 
import AudioPlayer from '@/components/partials/audio_player'; 
export default {
  name: 'Chat',
  components:{
    AudioRecord,
    AudioPlayer
  },
  data () {
    return {
      data: {chat: []},
      //blocks
      messages: '',
      // boolean
      my_id: null,
      closePop: false,
      resendDiv_showing: false,
      load: true,
      focusing: true,
      sidebarToggle: false,
      audio_input: false,
      // searching
      now_searching: 0,
      all_searching: 0,
      finding: {},
      search_text: '',
      // send
      text: '',
      files: [],
      resend:{
        id: null,
        name: '',
        type: null,
        title: '',
        content: '',
      },
      // styles
      ChatBody_styles: "height:calc(100% - 100px)",
      resendDiv_styles: "height:0",
      //Content blocks
      active_src: '',
      micro: 0,
      mictoInterval: '',
      teacher: '',
      writing: '',
      dateWrite: '',
      inerWriting: '',
      //scroll
      child: 0,
      goDown: false,
      newMes: 0,
      teacherStatus: false,
      position_head: "margin-left: 0",
      //recorder
      gumStream: '',
      recorder: '',
    }
  },

  created() {
    this.$store.commit('notice/RESET_UNREAD_MESSAGE');
  },
  computed: {
    isread() {
      return this.$store.getters['socketMessage/ISREAD']
    },
    teacherInfo(){
      let teacher = this.$store.getters['user/TEACHER']
      this.teacherStatus = teacher.status
      return teacher
    },
    newMesF(){
      return this.$store.getters['socketMessage/DATA'];
    },
    changeE(){
      return this.$mq.phone;
    },
    changeSidebarToggle(){
      return this.sidebarToggle;
    },
    writingF(){
      return this.$store.getters['socketMessage/WRITING'];
    },
  },
  watch: {
    isread(newData) {
      this.setIsRead()
    },
    teacherInfo(newData) {
      this.teacherStatus = newData.status
    },
    newMesF(newData) {
      if(!this.goDown) setTimeout(()=>{this.messages.scrollTo({top: this.messages.scrollHeight, behavior: "smooth"});},0);

      newData.data.sender_id = newData.data.sender;
      if(newData.data.isteacher || (!newData.data.isteacher && newData.data.sender_id != this.my_id)){
        clearInterval(this.inerWriting);
        this.writing = '';
        this.data.chat.push(newData.data);
        if(this.$socket) this.$socket.send(JSON.stringify({notice: 8}));
      }else{
        let you = false;
        let dat2 = newData.data;
        newData.data.isread = 0;
        for (let i = 0; i < this.data.chat.length; i++){
          let dat1 = this.data.chat[i];
          if(this.data.chat[i].mounted){
            if(dat1.content == dat2.content && dat1.title == dat2.title && dat1.reference == dat2.reference && dat1.type == dat2.type){
              you = true;
              this.data.chat.splice(i, 1, newData.data)
              break;
            }
          }
        }
        if (!you) this.getMyMes(newData)
      }
      if(this.goDown) if(newData.data.isteacher || (!newData.data.isteacher && newData.data.sender_id != this.my_id)) this.newMes++
      else setTimeout(()=>{this.messages.scrollTo({top: this.messages.scrollHeight, behavior: "smooth"});},100);
    },
    changeE(){
      if(this.$mq.phone) this.ChatBody_styles = "height:calc(100% - 50px)";
        else this.ChatBody_styles = "height:calc(100% - 100px)";
      let hei = 100;
      if(this.resend.id) hei += 40;
      this.changeBody(hei)
    },
    changeSidebarToggle(){
      this.$store.dispatch('menu/GET_MENU', {sidebarToggle: this.sidebarToggle});
    },
    writingF(newDate){
      this.dateWrite = newDate.writing;
      if(!this.writing) this.setDots();
    }
  },
  mounted(){
    window.addEventListener('keydown', ()=>{
      if(this.focusing && this.$refs.focus){
        this.$refs.focus.focus();
      } 
    })
    this.getGroup();
    this.ChatBody_styles = "height:calc(100% - 100px)";
    this.my_id = this.$getCookie('SAI');
    this.$http.post('/api', `method=GET-CHAT`)
    .then(res =>{
      this.data = res.data;
      if(this.data.status === 200) this.$socket.send(JSON.stringify({notice: 8}));
      if(this.data.status === 200 || this.data.status === 205){
        this.data.chat.reverse();
        setTimeout(()=>{
          this.messages = this.$refs["chat_body"];
          this.messages.scrollTo({
            top: this.messages.scrollHeight,
          });
          for (let i = 0; i < this.data.chat.length; i++){
            let data = this.data.chat[i];
            if(this.data.chat[i-1]){
              if(this.getDayMes(data.dt) != this.getDayMes(this.data.chat[i-1].dt)) data.prewDt = true;
            }else data.prewDt = true;
            data.printAva = this.checkNextMes(this.data.chat[i], this.data.chat[i-1]);
            if(data.type === 3) {
              let audio = new Audio(this.$fileUrl + data.content);
              audio.addEventListener('durationchange', e=>{
                if(audio.duration == Infinity) audio.currentTime = 1000000000 * Math.random();
                else{
                  data.audio = audio;
                  data.audio.addEventListener('timeupdate',e=>this.data.chat.splice(i, 1, data))
                  this.data.chat.splice(i, 1, data);
                }
              })
            }else
            this.data.chat.splice(i, 1, data);
          }
          this.messages.addEventListener('scroll', (e)=>this.scrollBody())
        },1);
      }
    })
    .catch(err => console.error(err))
  },
  methods:{
    setIsRead() {
      for(let i = 0; i < this.data.chat.length; i++)
        if(!this.data.chat[i].isread){
          let data = this.data.chat[i];
          data.isread = 1;
          this.data.chat.splice(i,1,data)
        }
    },
    setDots(){
      this.writing = 'Печатает';
      this.inerWriting = setInterval(()=>{
        this.writing += '.';
      },1000)
      setTimeout(()=>{
        clearInterval(this.inerWriting);
        let date = new Date().valueOf()
        if(date < this.dateWrite + 3000) this.setDots()
        else this.writing = '';
      },3000)
    },
    checkAva(ava){
      if(ava.split(':')[0] === 'http' || ava.split(':')[0] === 'https') return true
      else return false;
    },
    getMyMes(newData){
    if(newData.data.type == 3) {
        let audio = new Audio(this.$fileUrl + newData.data.content);
        newData.data.audio = audio;
        let len = this.data.chat.length;
        audio.addEventListener('durationchange', e=>{
          if(audio.duration == Infinity) audio.currentTime = 1000000000 * Math.random();
          else{
            newData.data.audio.addEventListener('timeupdate',e=>this.data.chat.splice(len, 1, newData.data))
            this.data.chat.push(newData.data);
          }
        })
      }else this.data.chat.push(newData.data);
      if(!this.goDown)setTimeout(()=>{this.messages.scrollTo({top: this.messages.scrollHeight, behavior: "smooth"});},0);
    },
    async getGroup(){
      let data = await this.$http.post('/api', `method=GET-GROUP`);
      if(data.status === 200) this.teacher = data.data.teacher;
    },
    getNameByType(type){
      let t;
      switch(type){
        case 2: t = 'Фото'; break;
        case 3: t = 'Аудио'; break;
        case 4: t = 'Файл'; break;
        case 5: t = 'Видео'; break;
        case 7: t = 'Задание'; break;
        case 8: t = 'Тест'; break;
        default: t = 'Файл'; break;
      }
      return t;
    },
    startRecord(){
      navigator.mediaDevices.getUserMedia({audio: true, video:false})
      .then(stream =>{
        this.audio_input = true;
        this.mictoInterval = setInterval(()=>{this.micro++},1000);
        this.recorder = new Recorder(new (window.AudioContext || window.webkitAudioContext)(), {
          // onAnalysed: data => this.$store.dispatch('socketMessage/GET_AUDIO', {audio: data.lineTo}),
        })
        this.gumStream = stream
        this.text = ' ';
        this.recorder.config.nFrequencyBars = 8000;
        this.recorder.init(this.gumStream)
        this.recorder.start(10)
      })
      .catch(err =>{
        clearInterval(this.mictoInterval);
        this.micro = 0;
        this.audio_input = false;
        console.error(err)
      });
    },
    stopRecord(flag){
      clearInterval(this.mictoInterval);
      this.micro = 0;
      this.text = '';
      this.audio_input = false;
      if(!flag){
        let traks = this.gumStream.getTracks()
        for(let i=0; i<traks.length; i++ ) traks[i].stop()
        this.recorder.stop()
        .then(datablob =>{})  
      }else{
        let traks = this.gumStream.getTracks()
        for(let i=0; i<traks.length; i++ ) traks[i].stop()
        this.recorder.stop()
        .then(datablob =>{
          let name = `Voice_0_${this.my_id}_${new Date().valueOf()}.wav`;
          let blob = datablob.blob;
          let audio = new Audio(URL.createObjectURL(blob));
          let len = this.data.chat.length;
          audio.addEventListener('durationchange', e=>{
            if(audio.duration == Infinity) audio.currentTime = 1000000000 * Math.random();
            else{
              data.audio = audio;
              data.audio.addEventListener('timeupdate',e=>this.data.chat.splice(len, 1, data))
              this.data.chat.splice(len, 1, data);
            }
          })
          let data = {
            title: '',
            content: name,
            audio: audio,
            type: 3,
            reference: this.resend.id ? this.resend.id : 0,
            refSender: this.resend.name,
            refType: this.resend.type,
            refTitle: this.resend.title,
            refContent: this.resend.content,
            delivered: 0,
            isteacher: 0,
            mounted: 1,
            dt: new Date(),
            not_original_dt: 1,
            ava: this.$store.getters['user/AVA'].split('/')[this.$NODE_ENV !== 'production' ? 5 : 3],
            sender_id: this.my_id,
            sender_name: this.$store.getters['user/USER'].firstname + ' ' + this.$store.getters['user/USER'].lastname
          }
          this.data.chat.push(data);
          this.$sendFile(blob, res =>{
            let res_id = this.resend.id;
            this.$socket.send(JSON.stringify({
              notice: 1,
              title: '',
              content: res.data.name,
              type: 3,
              reference: res_id,
            }));
            this.closeResend();
            if(!this.goDown) setTimeout(()=>{this.messages.scrollTo({top: this.messages.scrollHeight, behavior: "smooth"});},0);
          }, name)
        })
      }
    },
    downChat(){
      this.newMes = 0;
      setTimeout(()=>{this.messages.scrollTo({top: this.messages.scrollHeight, behavior: "smooth"})},0)
    },
    searchMes(){
      this.$http.post('/api', `method=SEARCH-MESSAGES&&text=${this.search_text}`).then(res => {
        if(res.status === 200){
          this.finding = res.data.messages;
          this.now_searching = 0;
          this.all_searching = this.finding.length;
          if(this.finding.length)this.scrollToMes(this.finding[0].mes_id)
        }else{
          this.finding = {};
          this.now_searching = 0;
          this.all_searching = 0;
        }
      })
    },
    nextSearch(next){
      if(next) this.now_searching++;
      else this.now_searching--;
      if(this.now_searching <= 0) this.now_searching = 0;
      if(this.now_searching >= this.all_searching - 1) this.now_searching = this.all_searching - 1;
      if(this.finding.length)this.scrollToMes(this.finding[this.now_searching].mes_id)
    },
    scrollBody(){
      if(this.$refs['days'])
      for(let i = this.$refs['days'].length - 1; i >= 0; i--){
        if(this.$refs['days'][i].offsetTop <= this.messages.scrollTop && this.child <= this.messages.scrollTop){
          if(this.child < this.$refs['days'][i].offsetTop)this.child = this.$refs['days'][i].offsetTop;
          this.$refs['days'][i].classList.add('current_message_time')
          break;
        }else {
          for(let j = 0; j < this.$refs['days'].length; j++){
            this.$refs['days'][j].classList.remove('current_message_time');
          }
          if(this.$refs['days'][i-1])this.child = this.$refs['days'][i-1].offsetTop;
        }
      }
      if(this.messages.scrollTop <= (this.messages.scrollHeight - this.messages.clientHeight - 500)) this.goDown = true;
      else this.goDown = false;
      if(this.messages.scrollTop <= 200 && this.load){
        this.load = false;
        this.downloadOldMes()
      }
    },
    downloadOldMes(id){
      this.$http.post('/api', `method=GET-CHAT&&mes_id=${this.data.chat[0].mes_id}`)
      .then(res =>{
        if(res.data.chat[0]){
          let scroll = this.messages.scrollHeight - this.messages.scrollTop - this.messages.clientHeight;
          let chat = [];
          for(let i = 0; i < res.data.chat.length; i++)
            chat.splice(0, 0, res.data.chat[i])
          this.data.chat = chat.concat(this.data.chat)
          for (let i = 0; i < this.data.chat.length; i++){
              if(this.data.chat[i].printAva) this.data.chat[i].printAva = false;
              if(this.data.chat[i].prewDt) this.data.chat[i].prewDt = false;
              let data = this.data.chat[i];
              if(this.data.chat[i-1]){
                if(this.getDayMes(data.dt) != this.getDayMes(this.data.chat[i-1].dt)) data.prewDt = true;
              }else data.prewDt = true;
              data.printAva = this.checkNextMes(this.data.chat[i], this.data.chat[i-1]);
              
              if(data.type === 3 && !data.audio) {
                let audio = new Audio(this.$fileUrl + data.content);
                audio.addEventListener('durationchange', e=>{
                  if(audio.duration == Infinity) audio.currentTime = 1000000000 * Math.random();
                  else{
                    data.audio = audio;
                    data.audio.addEventListener('timeupdate',e=>this.data.chat.splice(i, 1, data))
                    this.data.chat.splice(i, 1, data);
                  }
                })
              }else
              this.data.chat.splice(i, 1, data);
          }
          this.messages.scrollTo({top: Math.abs(scroll - this.messages.scrollHeight)});
          this.load = true;
          if(id) this.scrollToMes(id);
        }
      })
      .catch(err => console.error(err))
    },
    checkNextMes(mes1, mes2){
      if(!mes2) return true;
      if(mes1.isteacher != mes2.isteacher.isteacher && mes1.sender_id != mes2.sender_id) return true;
      return false
    },
    getDayMes(dt){
      let day = '';
      day += this.checkDay(new Date(dt).getDay()) + ', ';
      day += this.checkMonth(new Date(dt).getMonth()) + ' '; 
      day +=new Date(dt).getDate() + ', '; 
      day +=new Date(dt).getFullYear();
      return day;
    },
    checkDay(dt){
      switch(dt){
        case 1: return 'Понедельник'; break;
        case 2: return 'Вторник'; break;
        case 3: return 'Среда'; break;
        case 4: return 'Четверг'; break;
        case 5: return 'Пятница'; break;
        case 6: return 'Суббота'; break;
        case 0: return 'Воскресенье'; break;
      }
    },
    checkMonth(dt){
      switch(dt){
        case 0: return 'Январь'; break;
        case 1: return 'Февраль'; break;
        case 2: return 'Март'; break;
        case 3: return 'Апрель'; break;
        case 4: return 'Май'; break;
        case 5: return 'Июнь'; break;
        case 6: return 'Июль'; break;
        case 7: return 'Август'; break;
        case 8: return 'Сентябрь'; break;
        case 9: return 'Октябрь'; break;
        case 10: return 'Ноябрь'; break;
        case 11: return 'Декабрь'; break;
      }
    },
    // audio
    startNewAudio(audio, id){
      let j = null;
      for (let i = 0; i < this.data.chat.length; i++) {
        if(this.data.chat[i].audio)
          if(this.data.chat[i].mes_id != id) this.data.chat[i].audio.pause();
          else j = i;
      }
      if(audio){
        let dat = this.data.chat[j];
        dat.preplay = true;
        this.data.chat.splice(j, 1, dat)
        audio.paused ? audio.play() : audio.pause();
      }
    },
    audioGoTo(audio, e){
      let layer = this.$mq.phone ? e.layerX : e.layerX / 2;
      audio.currentTime = audio.duration / (100 / layer);
    },
    getTimeOnAudio(audio){
      let seconds = audio;
      let hours = 0;
      let minuts = 0;
      if(seconds >= 3600)
        while(seconds >= 3600){
          hours++;
          seconds -= 3600;
        }
      if(seconds >= 60)
        while(seconds >= 60){
          minuts++;
          seconds -= 60;
        }
      if(hours == 0) hours = '';
      else {
        if(hours < 10) hours = '0' + hours;
        hours += ':';
      }
      if(minuts < 10) minuts = '0' + minuts;
      if(seconds < 10) seconds = '0' + seconds;
      return hours + minuts + ':' + seconds;
    },
    openPicture(src){
      this.closePop = true;
      this.active_src = src;
    },
    closePopUp(){
      this.closePop = false;
    },
    scrollToMes(id){
      let mes = this.searchMesForResend(id);
      if(!mes) {
        this.downloadOldMes(id);
      }else{
        this.messages.scrollTo({
          top: mes.offsetTop - 15,
          behavior: "smooth"
        });
        mes.style.backgroundColor = "rgba(30, 131, 212, 0.1)"
        setTimeout((e)=>{
          mes.style.backgroundColor = "transparent"
        },2500)
      }
    },
    searchMesForResend(id){
      for (let j = this.$refs['mes'].length - 1; j >= 0; j--)
        if(this.$refs['mes'][j].id == ('mes' + id))
          return this.$refs['mes'][j];
    },
    resendF(sender_name, type, title, content, mes_id){
      for(let i = 0; i < this.data.chat.length; i++){
        if(this.data.chat[i].activ) {
          let data = this.data.chat[i];
          data.activ = false;
          this.data.chat.splice(i, 1, data);
        }
        if(this.data.chat[i].mes_id == mes_id){
          let data = this.data.chat[i];
          data.activ = true;
          this.data.chat.splice(i, 1, data);
        }
      }
      this.resend ={
        name: sender_name,
        type: type,
        title: title,
        content: content,
        id: mes_id
      }
      this.changeBody(140)
      this.resendDiv_styles = {height: '40px'};
      this.resendDiv_showing = true;
    },
    closeResend(){
      for(let i = 0; i < this.data.chat.length; i++){
        if(this.data.chat[i].activ){
          let data = this.data.chat[i];
          data.activ = false;
          this.data.chat.splice(i, 1, data);
        }
      }
      this.resend = {
        id: null,
        name: '',
        type: null,
        title: '',
        content: '',
      };
      this.changeBody(100)
      this.resendDiv_styles = {height: '0'};
      this.resendDiv_showing = false;
    },
    sendFile(e){
      let files = e.target.files || e.dataTransfer.files;
      if(!files[0]) return;
      this.files.push({uploadFile: true});
      let hei = 100;
      if(this.resend.id) hei += 40;
      this.changeBody(hei);
      if(files[0].type == 'text/javascript' || files[0].type == 'application/x-javascript') return;
      this.$sendFile(files[0], res =>{
        if(res.status === 200){
          files[0].path = res.data.name;
          files[0].sizeN = this.getSize(files[0].size)
          files[0].typing = this.getFileType(files[0].type)
          this.files.splice(this.files.length - 1, 1, files[0])
          let hei = 100;
          if(this.resend.id) hei += 40;
          this.changeBody(hei);
        }
      })
    },
    closeFile(fileIndex){
      this.files.splice(fileIndex, 1)
      let hei = 100;
      if(this.resend.id) hei += 40;
      this.changeBody(hei)
    },
    changeBody(hei){
      let len = 1;
      if(this.files.length >= 3) len = 2;
      if(this.files.length != 0)for(let i =  0; i < len; i++) if(this.$mq.phone) hei +=40; else hei +=40;      
      this.ChatBody_styles = {height: `calc(100% - ${hei}px)`};
    },
    checkEnter(e){
      if(e.keyCode == 13) 
      {
        e.preventDefault()
        if(e.ctrlKey)       this.text += '\n';
        else this.sendMes();
      }else
        this.$socket.send(JSON.stringify({
          notice: 11
        }));
    },
    sendMes(){
      if(this.files.length){
        for(let i = 0; i < this.files.length; i++){
          if(this.files[i].type){
            let data = {
              title: this.text,
              content: this.files[i].path,
              type: this.getFileType(this.files[i].type),
              reference: this.resend.id ? this.resend.id : 0,
              refSender: this.resend.name,
              refType: this.resend.type,
              refTitle: this.resend.title,
              refContent: this.resend.content,
              delivered: 0,
              isteacher: 0,
              isread: 0,
              mounted: 1,
              dt: new Date(),
              not_original_dt: 1,
              ava: this.$store.getters['user/AVA'].split('/')[this.$NODE_ENV !== 'production' ? 5 : 3],
              sender_id: this.my_id,
              sender_name: this.$store.getters['user/USER'].firstname + ' ' + this.$store.getters['user/USER'].lastname
            }
            this.data.chat.push(data);
            let text = this.text || '';
            let res_id = this.resend.id || 0;
            console.log('trying to send this: ', {
              notice: 1,
              title: this.text,
              content: this.files[i].path,
              type: this.getFileType(this.files[i].type),
              reference: res_id,
            })
            this.$socket.send(JSON.stringify({
              notice: 1,
              title: this.text,
              content: this.files[i].path,
              type: this.getFileType(this.files[i].type),
              reference: res_id,
            }));
            this.text = '';
            this.closeResend();
          }
        }
        for(let i = 0; i < this.files.length; i++)
          if(this.files[i].type){
            this.files.splice(i, 1);
            i--;
          }
      }else if(this.text){
        let data = {
          content: this.text,
          title: '',
          reference: this.resend.id ? this.resend.id : 0,
          refSender: this.resend.name,
          refType: this.resend.type,
          refTitle: this.resend.title,
          refContent: this.resend.content,
          type: 1,
          delivered: 0,
          isteacher: 0,
          mounted: 1,
          dt: new Date(),
          not_original_dt: 1,
          ava: this.$store.getters['user/AVA'].split('/')[this.$NODE_ENV !== 'production' ? 5 : 3],
          sender_id: this.my_id,
          sender_name: this.$store.getters['user/USER'].firstname + ' ' + this.$store.getters['user/USER'].lastname
        }
        this.data.chat.push(data);
        let count = 0;
        let send = false;
        let text = this.text || '';
        let res_id = this.resend.id || 0;
        let inter = setInterval(()=>{
          try{
            this.$socket.send(JSON.stringify({
              notice: 1,
              content: text,
              type: 1,
              reference: res_id,
            }));
            send = true;
          }catch(err){
            count++;
          }
            if(send) clearInterval(inter);
            if(count >= 1000) location.reload()
          },400)
        this.text = '';
        this.closeResend();
      }
      setTimeout(()=>{if(!this.goDown)this.messages.scrollTo({top: this.messages.scrollHeight, behavior: "smooth"});},0)
      this.changeBody(100);
    },
    getFileType(file)
    {
      let type = file.split('/')[0];
      switch(type)
      {
        case 'image':   return 2;
        case 'audio':   return 3;
        case 'video':   return 5;
        default:    return 4;
      }
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
  }
}
</script>
<style type="text/css" scoped>
  @import url(../../assets/styles/pages/web/chat.css) (min-width: 768px);
  @import url(../../assets/styles/pages/mobile/chat.css) (max-width: 768px);
</style>