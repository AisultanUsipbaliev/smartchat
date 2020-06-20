<template>
	<div class="droped-audio">
		<div class="flex-audio">
			<div class="black-record" id="sendRecord" @click="recording ? stopRecord(true) : startRecord()">
				<div class="red-record" :class="recording ? 'animateRecord' : '' "></div>
			</div>
			<span class="timer-audio-home">{{$functions.getTimeOnAudio(timer)}}</span>
			<transition name="slide-fade">
				<span class="stop-span" v-if="chat" @click="stopRecord(false)">Отмена</span>
				<span class="stop-span" v-else-if="recording" @click="stopRecord(true)">Стоп</span>
				<span class="stop-span" v-else @click="startRecord()">Записать</span>

			</transition>	
		</div>
		<div class="flex-audio" v-if="audio">
			<audio-player :srcer="audio"></audio-player>
		</div>
		<img src="/static/img/cancel.png" title="Удалить" class="delete-recording-audio" @click="stopRecord(false)" v-if="audio">
	</div>
</template>

<script>
	import Recorder from 'recorder-js'
	import audioPlayer from '@/components/partials/audio_player'
	export default{
		components:{
	    audioPlayer,
	  },
	  props: ['srcer', 'chat'],
		data(){
			return{
				recording: true,
				timer: 0,
				inter: null,
				recorder: null,
				gumStream: null,
				audio: null,
			}
		},
		mounted(){
			this.startRecord();
			if(this.srcer)
				this.audio = this.srcer;
		},
		methods:{
			startRecord(){
				this.recording = true;
				this.timer = 0;
				this.inter = setInterval(()=>this.timer++,1000)
				navigator.mediaDevices.getUserMedia({audio: true, video:false})
	      .then(stream =>{
	        this.recorder = new Recorder(new (window.AudioContext || window.webkitAudioContext)(), {})

	        this.gumStream = stream;
	        this.recorder.config.nFrequencyBars = 8000;
	        this.recorder.init(this.gumStream)
	        this.recorder.start(10)
	      })
	      .catch(err =>{
	        clearInterval(this.inter)
	        this.timer = 0;
	        this.recording = false;
	        console.error(err)
	      });
	      
			},
			stopRecord(flag){
				clearInterval(this.inter);
				this.timer = 0;
	      this.recording = false;
	      if(!flag){
	      	this.audio = null;
	        let traks = this.gumStream.getTracks()
	        for(let i=0; i<traks.length; i++ ) traks[i].stop()
	        this.recorder.stop()
	        .then(datablob =>{})
	        if(this.chat) this.$emit('audio-src', {stop: true});
	      }else{
	        let traks = this.gumStream.getTracks()
	        for(let i=0; i<traks.length; i++ ) traks[i].stop()
	        this.recorder.stop()
	        .then(datablob =>{
	          let name = `Voice_0_${this.my_id}_${new Date().valueOf()}.wav`;
	          let blob = datablob.blob;
	          this.audio = URL.createObjectURL(blob);
	          this.$emit('audio-src', {blob: blob, audio:this.audio, name: name});
	        })
	      }
			},
		}
	}
</script>
<style>
	@import url(../../assets/css/homeworks.css);
</style>