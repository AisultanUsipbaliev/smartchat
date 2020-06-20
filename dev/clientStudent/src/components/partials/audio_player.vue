<template>
	<div class="web-mt-audio">
		<audio :src="srcer" ref="audio" style="display: none"></audio>
    <div class="web-play" @click="startNewAudio()">
      <img :src="
      duration ? audio.paused ? !audio.paused  &&  currentTime < 0.5 ? '/static/img/prog.gif'
                                                             						: '/static/img/play.png' 
                           : '/static/img/pause.png' 
            : '/static/img/prog.gif'" 
    :class="audio.paused ? 'web-play-button' : 'web-pause-button' ">
    </div>
    <p class="web-time-audio" v-if="audio">{{duration ? currentTime ? getTimeOnAudio(currentTime^0) : getTimeOnAudio(duration^0) : '--:--'}}</p>
    <div class="audio-length" @click="audioGoTo(audio, $event)" >
      <div class="web-audio-progress":style="duration ? {width: `calc(100% / ${duration} * ${currentTime})`} : ''"></div>
    </div>
  </div>
</template>
<script>
	export default{
		props: ['srcer'],
		data(){
			return{
				audio: '',
				duration: '',
				currentTime: '',
			}
		},
		mounted(){
			this.getAudio()
		},
		methods:{
			getAudio(){
				this.audio = this.$refs['audio'];
	      this.audio.addEventListener('durationchange', e => {
					this.duration = this.audio.duration;
					this.currentTime = this.audio.currentTime;
	        if(this.audio.duration == Infinity) this.audio.currentTime = 1000000000 * Math.random();
	        else this.audio.addEventListener('timeupdate',e => this.currentTime = this.audio.currentTime);
	      })
	    },
	    startNewAudio(){
	    	let start = true;
	    	if(!this.audio.paused) start = false;
	    	let audios = document.getElementsByTagName('AUDIO');
	    	for(let i = 0; i < audios.length; i++)
	    		audios[i].pause();
	    	if(start) this.audio.play();
	    },
	    audioGoTo(audio, e){
	      let layer = e.offsetX * 0.9;
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
	    }
		}
	}
</script>
<style>
	@import url(../../assets/styles/pages/web/audioPlayer.css)
</style>