<template>
	<div class="lesson_count" :style="error ? {backgroundColor: 'linen'} : ''">
		<select class="noborder" :day='day' v-model="sStart" @mousedown="error = false">
			<option>нет</option>
			<option v-for="i in begin" :value="i">{{i}}:00</option>
		</select>
		<select class="noborder" :day='day' v-model="sFinish" @mousedown="error = false">
			<option>нет</option>
			<option v-for="i in end" :value="i">{{i}}:00</option>
		</select>
	</div>
</template> 

<script>

export default {
	name: 'selector',
	props:['start', 'finish', 'day'],
	data () {
		return {
			begin 	: [],
			end 	: [],
			sStart 	: 'нет',
			sFinish	: 'нет',
			error: false,
			graph: []
		}
	},
	created(){
		this.graph = this.$store.getters['profile/GRAPH'].graph;
		this.graphAction()
	},
	computed:{
		graphData() {
			return this.$store.getters['profile/GRAPH'].graph
		}
	},
	watch: {
		graphData(newData){
			this.graph = newData
			this.graphAction()
		},
		sStart: function(val) {
			let res = []
			// if(val == 'нет') 	for(let i=this.start+1; i<=this.finish; i++) res.push(i)
			// else 							for(let i=val+1; i<=this.finish; i++) res.push(i)
			// this.end = res
			if(val == 'нет') this.sFinish = 'нет'
		},
		sFinish: function(val) {
			let res = []
			// if(val == 'нет')	for(let i=this.start; i<=this.finish-1; i++) res.push(i)
			// else 							for(let i=this.start; i<val; i++) res.push(i)
			// this.begin = res
			if(val == 'нет') this.sStart = 'нет'
		}
	},
	methods: {
		graphAction(){
			for(let i = 0; i < this.graph.length; i++)
				if(this.day == this.graph[i].nday){
					this.sStart = this.graph[i].start;
					this.sFinish = this.graph[i].finish;
				}
			for(let i=this.start; i<=this.finish-1; i++) this.begin.push(i)
			for(let i=this.start+1; i<=this.finish; i++) this.end.push(i)
		}
	}
}

</script>
