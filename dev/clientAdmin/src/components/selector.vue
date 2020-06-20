<template>
  <tr>
	  <td>
	    <div class="row m-0 mb-2">
	      <p>{{$getFullWeekDayName(item.weekday)}}</p>
	    </div>
	  </td>
	  <td>
	    <div class="row m-0 mb-2">
	      <select v-bind:style="{ backgroundColor: item.start_color }" class="select table_select col-sm-12" v-model="start">
	        <option v-for="time in selectedTime" :value="time">{{time}}</option>
	      </select> 
	    </div>
	  </td>
	  <td>
	    <div class="row m-0 mb-2">
	      <select v-bind:style="{ backgroundColor: item.finish_color }" class="select table_select col-sm-12" v-model="finish">
	        <option v-for="time in selectedTime" :value="time">{{time}}</option>
	      </select> 
	    </div>
	  </td>
  </tr>
</template>

<script>
	export default{
		name: 'Selector',
		props: [
		'item',
		'selectedTime'
		],
		data(){
			return {
				start: 'нет',
				finish: 'нет'
			}
		},
		watch:{
			start(newData){
				this.finish = this.getTime(this.start);
				this.item.start = this.start;
				this.item.finish = this.finish;
			},
			finish(newData){
				this.start = this.getTime(this.finish, true);
				this.item.start = this.start;
				this.item.finish = this.finish;
			}
		},
		methods:{
			getTime(first, flag){
				for(let i = 0; i < this.selectedTime.length; i++)
					if(first === this.selectedTime[0])

						return this.selectedTime[0]

					else if(first === this.selectedTime[i]){
						let index = i + (flag ? -2 : 2)
						return this.selectedTime[index < 0 ? 0 : index]
					}
			},
		}
	}
</script>
