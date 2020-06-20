<template>
	<div class="content">
		{{log}}

		<audio :src="src" controls style="margin-top: 10vh;"></audio>
		<button style="width: 80px; height: 90px;" @click="butClick">{{butLabel}}</button>
	</div>
</template>
<script>
import Recorder from 'recorder-js'
export default {
	name: 'Anvar',
	data () {
		return {
			src: 'https://cabinet.smartchat.kz/common/files/15309845673553.6.mp3',
			gumStream: null,
			log: '',

			started: 1,
			butLabel: 'start',
			recorder: null
		}
	},
	created(){
	},	
	methods:{

		butClick() {
			switch(this.started) {

				case 1: 
					this.startRecord()
					this.butLabel = 'stop'
					this.started = 2
				break;
				case 2: 
					this.stopRecord()
					this.butLabel = 'start'
					this.started = 1
				break;
			}
		},

		startRecord() {
			console.log('recorder started...')
			let that = this
			
			navigator.mediaDevices.getUserMedia({ audio: true, video:false })
			.then(function(stream) {
				that.gumStream = stream

				let context = new (window.AudioContext || window.webkitAudioContext)()
				// let mediaStream = context.createMediaStreamSource(that.gumStream)
				// let filter = context.createBiquadFilter()

				// mediaStream.connect(filter)
				// filter.connect(context.destination)
				// filter.frequency.value = 10000

				that.recorder = new Recorder(context)
				that.recorder.config.nFrequencyBars = 8000
				that.recorder.init(that.gumStream)
				that.recorder.start(10)
				
				console.log('context: ', context)
				console.log('recorder: ', that.recorder)
				console.log('mediaStream: ', mediaStream)
				console.log('filter: ', filter)
			})
		},
		stopRecord() {

			console.log('recorder stopped')

			let that = this

			let traks = this.gumStream.getTracks()
			for(let i=0; i<traks.length; i++ ) traks[i].stop()
			
			this.recorder.stop()
			.then(that.getBlob)

		},
		getBlob(data) {
			this.recorder = null
			let that = this
			console.log(data.blob)

			this.$sendFile( data.blob, (res)=> {

				that.log += res.data.name
				that.src = `/common/files/${res.data.name}`

			}, new Date().valueOf() + '.wav' )
		}
	}
}
</script>