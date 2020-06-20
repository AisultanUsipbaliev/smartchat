<template>
	<div style="margin-left: 100px;">
		<div style="position: absolute; top: 200px">
		<div class="record_div" @click="clicker"></div>
		<div class="second_audio_div" @click="stop"></div> 
		</div>
		  <!-- <svg width="30" height="30">
		    <polygon :points="points"></polygon>
		    <circle cx="15" cy="15" r="15"></circle>
		  </svg>
		  <label>Sides: {{ sides }}</label>
		  <input 
		    type="range" 
		    min="2" 
		    max="500" 
		    v-model.number="sides"
		  >
		  <label>Minimum Radius: {{ minRadius }}%</label>
		  <input 
		    type="range" 
		    min="0" 
		    max="90" 
		    v-model.number="minRadius"
		  >
		  <label>Update Interval: {{ updateInterval }} milliseconds</label>
		  <input 
		    type="range" 
		    min="10" 
		    max="2000"
		    v-model.number="updateInterval"
		  > -->
	</div>
</template>
<script>
//svg	
	// 	export default{
	// 	  data: function () {
	// 	  	var min = 300;
	// 	  	var stats = Array.apply(null, { length: min })
	// 	    	.map(function () { return 100 })
	// 	  	return {
	// 	    	stats: stats,
	// 	    	points: generatePoints(stats),
	// 	      sides: min,
	// 	      minRadius: 55,
	// 	      interval: null,
	// 	      updateInterval: 125
	// 	    }
	// 	  },
	// 	  watch: {
	// 	  	sides: function (newSides, oldSides) {
	// 	    	var sidesDifference = newSides - oldSides
	// 	      if (sidesDifference > 0) {
	// 	      	for (var i = 1; i <= sidesDifference; i++) {
	// 	        	this.stats.push(this.newRandomValue())
	// 	        }
	// 	      } else {
	// 	        var absoluteSidesDifference = Math.abs(sidesDifference)
	// 	      	for (var i = 1; i <= absoluteSidesDifference; i++) {
	// 	        	this.stats.shift()
	// 	        }
	// 	      }
	// 	    },
	// 	    stats: function (newStats) {
	// 				TweenLite.to(
	// 	      	this.$data, 
	// 	        this.updateInterval / 1000, 
	// 	        { points: generatePoints(newStats) }
	// 	    	)
	// 	    },
	// 	    updateInterval: function () {
	// 	    	this.resetInterval()
	// 	    }
	// 	  },
	// 	  mounted: function () {
	// 	  	this.resetInterval()
	// 	  },
	// 	  methods: {
	// 	    randomizeStats: function () {
	// 	    	var vm = this
	// 	    	this.stats = this.stats.map(function () {
	// 	      	return vm.newRandomValue()
	// 	      })
	// 	    },
	// 	    newRandomValue: function () {
	// 	    	return Math.ceil(this.minRadius + Math.random() * (100 - this.minRadius))
	// 	    },
	// 	    resetInterval: function () {
	// 	    	var vm = this
	// 	    	clearInterval(this.interval)
	// 	      this.randomizeStats()
	// 	    	this.interval = setInterval(function () { 
	// 	      	vm.randomizeStats()
	// 	      }, this.updateInterval)
	// 	    }
	// 	  }
	// 	}

	// function valueToPoint (value, index, total) {
	//   var x     = 0
	//   var y     = -value/ 7
	//   var angle = Math.PI * 2 / total * index
	//   var cos   = Math.cos(angle)
	//   var sin   = Math.sin(angle)
	//   var tx    = x * cos - y * sin + 15
	//   var ty    = x * sin + y * cos + 15
	//   return { x: tx, y: ty }
	// }

	// function generatePoints (stats) {
	// 	var total = stats.length
	// 	return stats.map(function (stat, index) {
	//     var point = valueToPoint(stat, index, total)
	//     return point.x + ',' + point.y
	//   }).join(' ')
	// }

//recorder 2.0
	// import Recorder from 'recorderjs'
	// var recorder;
 //  export default{
	// 	name: 'Bauka',
	// 	data(){
	// 		return{
	// 			context: '',
	// 			buffer: '',
	// 			source: '', 
	// 		}
	// 	},
	// 	methods: {
 //      clicker(){
	// 			if (navigator.mediaDevices) {
	// 			    navigator.mediaDevices.getUserMedia ({audio: true})
	// 			    .then(async (stream) => {
	// 		        this.source = await this.context.createMediaStreamSource(stream);
	// 						recorder = await new Recorder(this.source, {workerPath: '../node_modules/recorderjs/recorderWorker.js',numChannels:1});
	// 						recorder.ondataavailable = event =>{
	// 							this.buffer = event;
	// 						}
	// 						recorder.record();
	// 			    })
	// 			    .catch((err) => console.error('The following gUM error occured: ' + err));
	// 			} else console.warn('getUserMedia not supported on your browser!');
 //      },
 //      stop(){
 //      	recorder.stop();
 //      	console.log(this.buffer)
	// 			recorder.exportWAV(function(blob) {
	// 				var url = URL.createObjectURL(blob);
	// 				var au = new Audio(url);
	// 				au.play();
	// 			});
 //      }
 //    },
 //    mounted(){
 //    	AudioContext = window.AudioContext || window.webkitAudioContext;
 //    	this.context = new AudioContext();
 //    }
	// }
//recorder
	// var mediaRecorder;
	// var blobURL;
	// import Recorder from 'recorder-js';
	// let audioContext;
	// let recorder;
	// let blob;
	// export default{
	// 	name: 'Bauka',
	// 	data(){
	// 		return{
	// 			mediaRecorder: '',
	// 			mediaConstraints: '',
	// 		}
	// 	},
	// 	methods: {
 //      clicker(){
	// 			audioContext =  new (window.AudioContext || window.webkitAudioContext)();
				
	// 			recorder = new Recorder(new AudioContext, {
	// 				// onAnalysed: data => console.log(data)
	// 			});
				 
	// 			let isRecording = false;
	// 			blob = null;
	// 			 navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	// 			 if(navigator.mediaDevices === undefined) navigator.mediaDevices = {};
	// 			 console.log(navigator.mediaDevices)

	// 			navigator.mediaDevices.getUserMedia({audio: true})
	// 			  .then(stream => recorder.init(stream))
	// 			  .catch(err => console.log('Uh oh... unable to get stream...', err));
				
	// 			recorder.start().then(() => isRecording = true);
 //      },
 //      stop(){
 //      	console.log(recorder)
 //      	recorder.stop().then(({blob, buffer}) => {blob = blob; console.log(blob)});
 //      	Recorder.download(blob, 'my-audio-file');
 //      }
 //    }
	// }
	// ---------------------------------------------------------------------------------

//recorder_old_SC
	
	var mediaRecorder ;
	var audioStream ;
	let canSendAudio = false;
	let audioTimeout = null;
	let blob;
  export default{
		name: 'Bauka',
		data(){
			return{
				context: '',
				buffer: '',
				source: '', 
			}
		},
		methods: {
      clicker(){
				navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
				navigator.getUserMedia({audio: true}, stream =>{
						audioStream = stream;
						mediaRecorder = new MediaRecorder(audioStream);
						mediaRecorder.start(360000);
						mediaRecorder.ondataavailable = e =>{ 
							blob = e; 
							console.log(blob)
							let name = `Voice_0_100_${new Date().valueOf()}.wav`;
			      	this.$sendFile(blob.data, res =>{
			          this.$socket.send(JSON.stringify({
			            notice: 1,
			            title: '',
			            content: res.data.name,
			            type: 3,
			            reference: 0,
			          }));
			          }, name);
						}
					}, err => console.error(err));
			
      },
      stop(){
      	mediaRecorder.stop();
      }
    }
	}
			audioTimeout = setTimeout(()=>
				{
					canSendAudio = true;
				}, 3000);

</script>

<style scoped>
	@import url(../../assets/styles/pages/web/chat.css);

	svg{
		display: flex; 
		justify-content: center;
		align-items: center;
	}
	polygon{ 
		fill: #1e83d4;
		z-index: 10;
	}
	circle {
	  fill: transparent;
	  stroke: #1e83d4;
	}
	circle.inner {
	  fill: #f00;
	  stroke: transparent;
	}
	input[type="range"] {
	  display: block;
	  width: 100%;
	  margin-bottom: 15px;
	}

</style>