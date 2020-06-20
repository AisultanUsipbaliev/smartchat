<template>
	<div class="droped-audio">
		<div class="flex-audio">
			<div class="black-record" @click="recording ? stopRecord(true) : startRecord()">
				<div class="red-record" :class="recording ? 'animateRecord' : '' "></div>
			</div>
			<span class="timer-audio-home">{{getTimeOnAudio(timer)}}</span>
			<transition name="slide-fade">
				<span class="stop-span" id="sendRecord" v-if="recording" @click="stopRecord(true)">Стоп</span>
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
	  props: ['srcer'],
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
	      }else{
	        let traks = this.gumStream.getTracks()
	        for(let i=0; i<traks.length; i++ ) traks[i].stop()
	        this.recorder.stop()
	        .then(datablob =>{
	          let name = `Voice_1_student-id_${new Date().valueOf()}.wav`;
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
	/*@import url(../../assets/css/homeworks.css);*/

.droped-audio:hover{
	background-color: #fff;
}
.droped-audio{
	display: flex;
	justify-content: left;
	flex-wrap: wrap;
	align-items: center;
	height: 50px;
	width: 100%;
	height: 100%;
	margin: 0 auto;
	min-width: 250px;
	box-sizing: border-box;
	border: 1px solid transparent;
	background-color: #fff;
}
.flex-audio{
	display: flex;
	align-items: center;
}
.black-record{
	height: 25px;
	width: 25px;
	border: 1px solid #1e83d4;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	margin-right: 5px;
}
.animateRecord{
	animation: animateRc 1s infinite ease;
}
@keyframes animateRc{
	0%{transform: scale(1);}
	50%{transform: scale(.8);}
	100%{transform: scale(1);}
}
.red-record{
	height: 15px;
	width: 15px;
	border-radius: 50%;
	background-color: #1e83d4;
	cursor: pointer;
}
.timer-audio-home{
	transition: .2s ease;
	margin-right: 5px;
	font-size: 14px;
	color: #1e83d4;
}
.delete-recording-audio{
	height: 15px;
	cursor: pointer;
}

</style>