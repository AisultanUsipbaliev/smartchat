<!-- <template>
	<div :class="fullscreen ? 'video' : 'video__small'" @mousedown="playerMove" @touchstart="playerMove" :style="!fullscreen ? {top: top + 'px', left: left + 'px'} : ''">
		<video ref="video" src="/static/video/video.mp4"></video>
		<div class="controllers" :class="!controllers ? 'controllers__hidden' : 'controllers__show'">
			<div class="left_ponel">
				<fai class="play" @click="watchVideo()" :icon=" start && currentTime !== duration ? 'pause' : 'play'"/>
				<span v-if="player">{{getTimeOnAudio(currentTime)}} / {{getTimeOnAudio(duration)}}</span>
				<div class="play" @mousemove="showVolume" @mouseover="hiddenVolume">
					<fai @click="mutedVideo()" :icon="muted ? 'volume-mute' : volume > 0.4 ? 'volume-up' : !volume ? 'volume-off' : 'volume-down'"/>
					<div class="volume" :class="!changeVolume ? 'volume__hidden' : 'volume__show'" @click="goToVolume" ref="volume">
						<div class="volume__paint" :style="{width: volume * 100 + '%'}"></div>
						<div class="volume__paint" :style="{width: '100%', backgroundColor: '#ffffff90'}"></div>
						<div class="circle" :style="{marginLeft: `calc(100% / ${80} * ${volume * 80})`, position: 'absolute', marginTop: '1px'}"></div>
					</div>
				</div>
			</div>
			<fai class="play" @click="openMedia()" :icon="fullscreen ? 'compress' : 'expand'"/>
		</div>
		<div class="timer" @click="goToVideo" ref="timer" :class="!controllers ? 'controllers__hidden' : 'controllers__show'">
			<div class="timer__paint" :style="{width: `calc(100% / ${duration} * ${currentTime})`}"></div>
			<div class="circle" :style="{marginLeft: `calc(100% / ${duration} * ${currentTime})`}"></div>
		</div>
	</div>
</template>

<script>
	import fscreen from 'fscreen';
	export default{
		data(){
			return{
				player: '',
				controllers: true,
				start: false,
				fullscreen: false,
				currentTime: 0,
				duration: 0,
				muted: false,
				volume: 1,
				changeVolume: false,
				chanceToHidden: false,
				timeoutHidden: '',

				// move
				top: 0,
				left: 0,
			}
		},
		mounted(){
			window.onresize = () => {
					if(this.left <= 0) this.left = 0
					else if(this.left >= document.body.clientWidth - this.player.clientWidth) this.left = document.body.clientWidth - this.player.clientWidth - 6;
					if(this.top <= 0) this.top = 0
					else if(this.top >= document.body.clientHeight - this.player.clientHeight) this.top = document.body.clientHeight - this.player.clientHeight - 6;
      }
			let html = document.documentElement;
			document.body.addEventListener('keyup',(e)=>{
				if(e.keyCode == 70){
					if(!this.fullscreen)	fscreen.requestFullscreen(html);
					else 									fscreen.exitFullscreen()
					this.fullscreen = !this.fullscreen;
				}else if(e.keyCode == 32) this.watchVideo();
				else if(e.keyCode == 38){
					if(this.volume <= 0.9){
						this.volume += 0.1;
			      this.player.volume = this.volume;
			    }else{
						this.volume = 1;
			      this.player.volume = this.volume;
			    }
				}else if(e.keyCode == 40){
					if(this.volume >= 0.1){
						this.volume -= 0.1;
			      this.player.volume = this.volume;
			    }else{
						this.volume = 0;
			      this.player.volume = this.volume;
			    }
				}
			})
			document.body.scrollTo({top: document.body.scrollHeight})
			this.player = this.$refs.video;
			this.left = document.body.clientWidth - this.player.clientWidth - 6;
			this.top = document.body.clientHeight - this.player.clientHeight - 6;
			
			let inter = setInterval(()=>{
				this.duration = this.player.duration;
				if(this.duration) clearInterval(inter)
			},10);
			
			this.player.addEventListener('timeupdate',e=> {
				this.currentTime = e.target.currentTime;
				})
			let timer;
			document.body.addEventListener('mousemove', ()=>{
				this.controllers = true;
				document.body.style = "cursor: normal"
				clearTimeout(timer);
				timer = setTimeout(()=>{
					this.controllers = false;
					document.body.style = "cursor: none"
				},500000);
			})
		},
		methods:{
			playerMove(e){
				if(!this.fullscreen){
					let startY = e.offsetY;
					let startX = e.offsetX;
					if(!startY){
						let rect = e.target.getBoundingClientRect();
						startY = e.touches[0].pageY - rect.top;
						startX = e.touches[0].pageX - rect.left;
					}
					document.onmousedown = ()=>{return false};
					document.onmousemove = (e)=>{
						this.left = e.pageX - startX;
						this.top = e.pageY - startY;
						if(this.left <= 0) this.left = 0
						else if(this.left >= document.body.clientWidth - this.player.clientWidth) this.left = document.body.clientWidth - this.player.clientWidth - 6;
						if(this.top <= 0) this.top = 0
						else if(this.top >= document.body.clientHeight - this.player.clientHeight) this.top = document.body.clientHeight - this.player.clientHeight - 6;
					}
					document.onmouseup = ()=>{
						document.onmousedown = ()=>{};
						document.onmousemove = ()=>{};
					}
					if(this.$mq.phone){
						document.ontouchstart = ()=>{return false};
						document.ontouchmove = (e)=>{
							e.stopPropagation();
							e = e.touches[0] || e;
							this.left = e.pageX - startX;
							this.top = e.pageY - startY;
							if(this.left <= 0) this.left = 0
							else if(this.left >= document.body.clientWidth - this.player.clientWidth) this.left = document.body.clientWidth - this.player.clientWidth - 6;
							if(this.top <= 0) this.top = 0
							else if(this.top >= document.body.clientHeight - this.player.clientHeight) this.top = document.body.clientHeight - this.player.clientHeight - 6;
						}
						document.ontouchend = ()=>{
							document.ontouchstart = ()=>{};
							document.ontouchmove = ()=>{};
						}
					}
				}
			},
			showVolume(e){
				clearTimeout(this.timeoutHidden)
				this.changeVolume = true;
				this.chanceToHidden = true;
				this.timeoutHidden = setTimeout(()=>{
					this.chanceToHidden = false;
				},1000)
			},
			hiddenVolume(){
				setTimeout(()=>{
					if(this.chanceToHidden == false) this.changeVolume = false;
				},1500)
			},
			watchVideo(){
				if(this.start) this.player.pause()
				else 					 this.player.play()
				this.start = !this.start;
			},
			goToVolume(e){
				let onePercent = this.$refs['volume'].clientWidth;
				this.volume = e.layerX / onePercent;
	      this.player.volume = this.volume;
			},
			goToVideo(e){
				let lay = e.layerX;
				let onePercent = this.$refs['timer'].clientWidth / 100;
				let layer = lay / onePercent;
	      this.player.currentTime = this.player.duration / (100 / layer);
			},
			mutedVideo(){
				this.muted = ! this.muted;
				this.player.muted = this.muted;
			},
			openMedia(){
				let html = document.documentElement;
				this.fullscreen = !this.fullscreen;
				if(this.fullscreen)   fscreen.requestFullscreen(html);
				else 									fscreen.exitFullscreen()
			},
			getTimeOnAudio(audio){
      let seconds = Number(audio)^0;
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

		}
	}
</script>

<style>
	img{
		cursor: pointer;
	}
	.video{
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background-color: #000;
		z-index: 1000000;
		box-sizing: border-box;
	}
	.video__small{
		border: 3px solid #1e83d4;
		position: fixed;
		width: 100%;
		max-width: 350px;
		height: 175px;
		bottom: 5px;
		right: 5px;
		background-color: #000;
		z-index: 1000000;
		box-sizing: border-box;
	}
	.controllers{
		color: #ffffff90;
		background: linear-gradient(to bottom, #00000000 0%,#000 100%);
		z-index: 2;
		padding: 0 10px 10px;
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 30px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		transition: 0.3s;
	}
	.controllers__show{
		opacity: 1;
		bottom: 0;
	}
	.controllers__hidden{
		opacity: 0;
		bottom: -10px;
	}
	.left_ponel{
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-width: 10em;
	}
	.timer{
		cursor: pointer;
		z-index: 2;
		width: 100%;
		height: 5px;
		bottom: 35px;
		background-color: #ffffff30;
		position: absolute;
	}
	.timer__paint{
		height: 100%;
		position: absolute;
		background-color: #1e83d4;
	}
	.circle{
		height: 10px;
		width: 10px;
		border-radius: 50%;
		margin-top: -2.5px;
		background-color: #fff;
		z-index: 2;
		left: 0;
	}
	video{
		height: 100%;
		width: 100%;
		position: absolute;
		z-index: 1;
	}
	.play{
		width: 20px;
		height: 100%;
		font-size: 20px;
		color: #fff;
		position: relative; 
	}
	.volume{
		cursor: pointer;
		width: 80px;
		border-radius: 0 5px 5px 0;
		height: 12px;
		background-color: #222222;
		position: absolute;
		bottom: 5px;
		left: 25px;
		display: flex;
		justify-content: center;
		transition: 0.3s;
	}
	.volume_show{
		opacity: 1;
		left: 25px;
	}
	.volume__hidden{
		opacity: 0;
		left: 15px;
	}
	.volume__paint{
		width: 100%;
		left: 0;
		bottom: 3px;
		height: 6px;
		position: absolute;
		background-color: #1e83d4;
		border-radius: inherit;
	}
	body{
		height: 100vh;
		width: 100vw;
	}
</style> -->