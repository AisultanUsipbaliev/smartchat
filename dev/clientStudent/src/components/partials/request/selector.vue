<template>
	<div class="lesson_count">
		<select class="noborder" :day='day' v-model="sStart">
			<option>нет</option>
			<option v-for="i in begin" :value="i">{{i}}:00</option>
		</select>
		-
		<select class="noborder" :day='day' v-model="sFinish">
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
			sFinish	: 'нет'
		}
	},
	created(){
		for(let i=this.start; i<=this.finish-1; i++) this.begin.push(i)
		for(let i=this.start+1; i<=this.finish; i++) this.end.push(i)
	},
	watch: {
		sStart: function(val) {
			// let res = []
			// if(val == 'нет') 	for(let i=this.start+1; i<=this.finish; i++) res.push(i)
			// else 							for(let i=val+1; i<=this.finish; i++) res.push(i)
			// this.end = res
			if(val != 'нет') 	this.sFinish = val + 1
			else this.sFinish = 'нет'
		},
		sFinish: function(val) {
			// let res = []
			// if(val == 'нет')	for(let i=this.start; i<=this.finish-1; i++) res.push(i)
			// else 							for(let i=this.start; i<val; i++) res.push(i)
			// this.begin = res
			if(val != 'нет') 	this.sStart = val - 1
			else this.sStart = 'нет'
		}
	}
}

</script>
