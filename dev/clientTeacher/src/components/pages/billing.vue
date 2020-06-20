<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content">
		<loading v-if="loading"></loading>
		<div class="billing">
			<div class="billing-day">
				<div class="billing-head">
					<span :class="cur_time == index ? 'active-month-billing' : ''" class="month-billing-time" :key="index"
								@click="sliceBetween(index)" v-for="(title, index) in head_title">
					{{title}}
				</span>
				</div>
				<div class="billing-body">
					<span class="billing-title" :class="$mq.phone ? 'mobile-block' : ''" v-if="cur_time !== 3">
						<fai @click="switchDate(-1)" icon="chevron-left" class="left"/>
						{{cur_name}}
						<fai @click="switchDate(1)" icon="chevron-right" class="right"/>
					</span>
					<span class="billing-title" :class="$mq.phone ? 'mobile-block' : ''" v-else>
						<input type="date" class="billing-date" v-model="pre_start" @change="validateDate()">
						<div>-</div>
						<input type="date" class="billing-date" v-model="pre_end" @change="validateDate()">
					</span>
					<div class="nothing-content" v-if="billing && !billing.length">Транзакций нет</div>
					<div class="billing-row" v-for="transaction in billing">
						<p class="about-billing-row">{{transaction.comment}}</p>
						<div class="flexbox">
							<p :class="transaction.amount >= 0 ? 'change-balans-green' : 'change-balans-red'">{{transaction.amount >= 0 ? '+' : ''}}{{transaction.amount}}{{transaction.currency}}</p>
							<p class="billing-row-date">{{$functions.getNormalDate(transaction.dt)}}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="billing-balans">
				<div class="have-money">
					<p class="all-billing">Баланс за {{periodName}}</p>
					<p class="balance-billing">{{plus - minus || 0}} <fai class="tenge" icon="tenge"/></p>
				</div>
				<div class="billing-month">
					<p class="money-in-month">
					<!-- За месяц -->
				</p>
					<div class="plusornot">
						<span class="plus-balans">+{{plus || 0}}</span>
						<span class="minus-balans">-{{minus || 0}}</span>
					</div>
				</div>

				<!-- <span class="vipiska" @click="getReport()" :class="$mq.phone ? 'mobile-block' : ''">Выписка</span> -->
			</div>
		</div>
	</div>
</template>

<script>
	import download from 'js-file-download'
	export default{
		name: 'Billing',
		data(){
			return{
				billing: [],
				head_title:['Месяц','Три месяца','Полгода','За период'],
				minus: null,
				plus: null,
				start: '',
				pre_start: '',
				end: '',
				pre_end: '',
				cur_time: 0,
				cur_name: '',
				available: '',
				loading: false,
				periodName: 'месяц'
			}
		},
	  computed:{
			userInfo() {
				return this.$store.getters['profile/DATA'];
			},
		},
		watch:{
			userInfo(newData){
				this.available = this.$store.getters['profile/DATA'].data.amount;
			}
		},
		mounted(){
			this.available = this.$store.getters['profile/DATA'].data.amount;
      this.start = this.getFirstDate('one', false);
      this.end = this.getFirstDate('one', true);
      let month = new Date(this.start).getMonth() + 1;
      month = month > 11 ? 0 : month;
      this.cur_name = this.$functions.getFullMonth(month) + ' ' + (new Date(this.start).getMonth() != 11 ? new Date(this.start).getFullYear() : new Date(this.start).getFullYear() + 1);
			this.getBilling();
		},
		methods:{
			validateDate(){
				if(this.pre_start && this.pre_end){
					this.start = new Date(new Date(this.pre_start).valueOf() + new Date(this.pre_start).getTimezoneOffset() * 60000);
					this.end = new Date(new Date(this.pre_end).valueOf() + new Date(this.pre_end).getTimezoneOffset() * 60000);
					this.getBilling()
				}
			},
			switchDate(ind){
				ind = ind * (this.cur_time * 3) || ind;
				let start = new Date(this.start);
				let end = new Date(this.end);
        this.start = start.setMonth(start.getMonth() + ind);
        this.end = end.setMonth(end.getMonth() + ind);
        if(this.cur_time !== 0)
	        this.cur_name = this.$functions.getFullMonth(start.getMonth()) + ' ' + start.getFullYear() + ' - ' + this.$functions.getFullMonth(end.getMonth() - 1 < 0 ? 11 : end.getMonth() - 1) + ' ' + start.getFullYear();
      	else this.cur_name = this.$functions.getFullMonth(start.getMonth() + 1 > 11 ? 0 : start.getMonth() + 1) + ' ' + (start.getMonth() != 11 ? start.getFullYear() : start.getFullYear() + 1);
	      this.getBilling();
	    },
	    sliceBetween(between){
	      this.cur_time = between;
	      switch(between){
	        case 0: {
	          this.start = this.getFirstDate('one', false);
	          this.end = this.getFirstDate('one', true);
	          this.cur_name = this.$functions.getFullMonth(new Date(this.start).getMonth() + 1) + ' ' + new Date().getFullYear();
	          this.periodName = 'месяц'
	        }; break;
	        case 1: {
	          this.start = this.getFirstDate('three', false); 
	          this.end = this.getFirstDate('three', true); 
	          this.cur_name = this.$functions.getFullMonth(new Date(this.start).getMonth()) + ' ' + new Date().getFullYear() + ' - ' + this.$functions.getFullMonth(new Date(this.end).getMonth() - 1) + ' ' + new Date().getFullYear();
	          this.periodName = 'три месяца'
	        }; break;
	        case 2: {
	          this.start = this.getFirstDate('six', false); 
	          this.end = this.getFirstDate('six', true);
	          this.cur_name = this.$functions.getFullMonth(new Date(this.start).getMonth()) + ' ' + new Date().getFullYear() + ' - ' + this.$functions.getFullMonth(new Date(this.end).getMonth() - 1) + ' ' + new Date().getFullYear();
	        	this.periodName = 'полгода'
	        }; break;
	        case 3: {
	        	this.start = '';
	        	this.end 	 = '';
	        	this.periodName = 'период'
	        }
	      }
	      this.getBilling();
	    },
	    getFirstDate(format, end){
	      let dt = new Date();
	      let betw;
	      if(format && format !== 'one'){
	      	betw = this.getFirstFourth(format, end);
	        dt.setMonth(betw);
	      }else
	      	dt.setMonth(new Date().getMonth());
        if(!end) dt.setDate(0);
        else     dt.setDate(this.getMaxDate(dt.getFullYear(), dt.getMonth()));

	      dt = new Date(dt.getTime() - dt.getTime() % 86400000);
	      dt = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60000);
	      if(end) dt = new Date(dt.getTime() + (24*60*60*1000))
	      return dt;
	    },
	    getMaxDate(y, m) {
	      if (m == 1) return y%4 || (!(y%100) && y%400 ) ? 28 : 29;
	      else    		return m===3 || m===5 || m===8 || m===10 ? 30 : 31;
	    },
	    getFirstFourth(format, end){
	    	let now = new Date().getMonth();
	    	if(format == 'six')
	    		if(!end)
	    			if(now < 6) return 0;
	    			else return 6;
	    		else
	    			if(now < 6) return 5;
	    			else return 11;
	    	else
	    		if(!end)
	    			if(now < 3) return 0;
	    			else if(now < 6) return 3;
	    			else if(now < 9) return 6;
	    			else return 9;
	    		else
	    			if(now < 3) return 2;
	    			else if(now < 6) return 5;
	    			else if(now < 9) return 8;
	    			else return 11;
	    },
			getBilling(){
				if(this.start && this.end){
					this.loading = true;
					this.$http.post('/api', `method=GET-BALANCE&begin=${this.start.valueOf()}&end=${this.end.valueOf()}`)
					.then( res => {
						if(res.status === 200) this.billing = res.data.balance;
						else this.billing = null;
						this.minus = res.data.minus;
						this.plus = res.data.plus;
					})
					.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-BALANCE'}) )
					.finally( () => this.loading = false )
				}
			},
			getReport(){
				this.$http.post('/api', `method=GET-BALANCE-REPORT&begin=${this.start.valueOf()}&end=${this.end.valueOf()}`, {responseType: 'blob'})
				.then( res => download(res.data, 'statement_from_SmartChat.xlsx') )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-BALANCE-REPORT'}) )
			},
		}
	}
</script>
<style>
	@import url(../../assets/css/billing.css);
</style>