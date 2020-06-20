<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-7">
        <div class="card">
          <div class="card__header ">
            <h2>Биллинг</h2>
            <ul class="card__action">
              <li>
                <a href="#;"><fai icon="expand-arrows-alt"/></a>
              </li>
            </ul>
          </div>
          <div class="card__body">
            <div class="table-filter-block">
              <div class="row">
                <div class="col-md-5 col-sm-12">
                  <label for="select">Показать по : </label>
                  <select v-model="limit" id="select" class="select form-control-sm" @change="getData();">
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                    <option :value="100">100</option>
                  </select>
                </div>
                <div class="col-md-2 col-sm-12"></div>
                <div class="col-md-5 col-sm-12">
                  <label for="search">Поиск : </label>
                  <input id="search" type="text" @keyup="getData()" v-model="search" placeholder="Введите текст" class="input form-control-sm">
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th v-for="name in head">
                      <div class="table__sort">
                        <span>{{name.name}}</span>
                        <div class="table__sort-icons" v-if="name.search" @click="toggleColumn(name.search);getData()">
                          <fai icon="sort-up" :class="[name.search === column && !order ? 'text-dark' : 'text-muted']"/>
                          <fai icon="sort-down" :class="[name.search === column && order ? 'text-dark' : 'text-muted']"/>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in transactions" :key="index">
                    <td v-if="item.student_id">
                      <router-link :to="{ name:'StudentDetail', params:{id:item.student_id} }" class="table__link">{{item.fio}}</router-link>
                    </td>
                    <td v-else>-</td>
                    <td v-if="item.dt">{{item.dt}}</td>
                    <td v-else>-</td>
                    <td v-if="item.amount">{{item.amount}}</td>
                    <td v-else>-</td>
                    <td v-if="item.rate_name">{{item.rate_name}}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>
              <div class="row table-footer-btn-block m-0" v-if="pagination">
                <button class="col-12 btn mt-2" @click="getData(true)">Показать еще</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card__header">
          <span class="col-md-4">Статистика</span>
          <div class="col-md-2 between" @click="sliceBetween(0)" :class="cur_time == 0 ? 'between__activ' : ''">Общая</div>
          <div class="col-md-2 between" @click="sliceBetween(1)" :class="cur_time == 1 ? 'between__activ' : ''">Год</div>
          <div class="col-md-2 between" @click="sliceBetween(2)" :class="cur_time == 2 ? 'between__activ' : ''">Месяц</div>
          <div class="col-md-2 between" @click="sliceBetween(3)" :class="cur_time == 3 ? 'between__activ' : ''">Неделя</div>
        </div>
        <div class="card__body" style="padding-bottom: 0">
          <div class="row justify-content-center">
            <div class="col-sm-1 text-cent" v-if="cur_time" @click="switchDate(-1)"><</div>
            <div :class="cur_time ? 'col-sm-8' : 'col-sm-12'" class="text-cent">{{cur_name}}</div>
            <div class="col-sm-1 text-cent" v-if="cur_time" @click="switchDate(1)">></div>
          </div>
          <div class="row">
            <div class="col-sm-12 about_transaction">Стоимость: <span>{{count}}KZT</span></div>
            <div class="col-sm-12 about_transaction">Транзакций: <span>{{operations}}шт.</span></div>
          </div>
          <div class="graph">
            <div class="tower" v-for="(table, towerIndex) in graph" @mouseout="table.focus = false" @mousmove="table.focus = true" :key="towerIndex":style="{height: 'calc(100% + ' + table.amount + ' - ' + max + ')'}">
              <!-- <div class="tower_focus" v-show="table.focus == true"></div> -->
              <div class="tower_name">{{$getShortMonthName(new Date(new Date().setMonth(new Date().getMonth() - towerIndex + graph.length - 1)).getMonth())}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Billing',
  data () {
    return {
      head: [
        {
          name: 'Студент',
          search: 2
        },
        {
          name: 'Дата',
          search: 4
        },
        {
          name: 'Взнос',
          search: 0
        },
        {
          name: 'Тариф',
          search: 0
        }
      ],
    transactions: [],
    order: true,
    column: 1,
    limit: 25,
    from: 0,
    pagination: false,
    search: '',

    cur_time: 0,
    cur_name: 'Общая',
    count: '',
    operations: null,
    start: '',
    end: '',
    graph: [],
    max: -1,
    }
  },
  created() {
    this.getData(true);
    this.getInfo();
    let s = this.getFirstDate('month', false);
    let e = this.getFirstDate('month', true);
    for(let i = 7; i >= 0; i--) {
      s = new Date(s.setMonth(s.getMonth() - 1));
      e = new Date(e.setMonth(e.getMonth() - 1));
     this.getGraphInfo(s, e)
    }
    for(let i = 0; i < this.graph.length; i++)
      if(this.max < this.graph[i].amount) this.max = this.graph[i].amount;
    
  },
  methods: {
    switchDate(ind){
      switch(this.cur_time){
        case 1: {
          this.start = new Date(this.start).setFullYear(new Date(this.start).getFullYear() + ind)
          this.end = new Date(this.end).setFullYear(new Date(this.end).getFullYear() + ind)
          this.cur_name = new Date(this.start).getFullYear();
        }; break;
        case 2: {
          this.start = new Date(this.start).setMonth(new Date(this.start).getMonth() + ind)
          this.end = new Date(this.end).setMonth(new Date(this.end).getMonth() + ind)
          this.cur_name = this.$getFullMonthName(new Date(this.start).getMonth()) + ' ' + new Date(this.start).getFullYear();
        }; break;
        case 3: {
          this.start = new Date(this.start).setDate(new Date(this.start).getDate() + (ind * 7))
          this.end = new Date(this.end).setDate(new Date(this.end).getDate() + (ind * 7))
          this.cur_name = this.$getFullMonthName(new Date(this.start).getMonth()) + ' ';
          this.cur_name += new Date(this.start).getDate();
          this.cur_name += new Date(this.start).getMonth() == new Date(this.end).getMonth() ? ' - ' 
                                                           : ' - ' + this.$getFullMonthName(new Date(this.end).getMonth()) + ' ';
          this.cur_name += new Date(this.end).getDate();
        }; break;
      }
      this.getInfo();
    },
    sliceBetween(between){
      this.cur_time = between;
      switch(between){
        case 0: {
          this.start = ''; 
          this.end = ''; 
          this.cur_name = 'Общая';
        }; break;
        case 1: {
          this.start = this.getFirstDate('year', false); 
          this.end = this.getFirstDate('year', true); 
          this.cur_name = new Date().getFullYear();
        }; break;
        case 2: {
          this.start = this.getFirstDate('month', false); 
          this.end = this.getFirstDate('month', true);
          this.cur_name = this.$getFullMonthName(new Date().getMonth()) + ' ' + new Date().getFullYear();
        }; break;
        case 3: {
          this.start = this.getFirstDate('week', false); 
          this.end = this.getFirstDate('week', true);
          this.cur_name = this.$getFullMonthName(new Date(this.start).getMonth()) + ' ';
          this.cur_name += new Date(this.start).getDate();
          this.cur_name += new Date(this.start).getMonth() == new Date(this.end).getMonth() ? ' - ' 
                                                           : ' - ' + this.$getFullMonthName(new Date(this.end).getMonth()) + ' ';
          this.cur_name += new Date(this.end).getDate();
        }; break;
      }
      this.getInfo()
    },
    getFirstDate(format, end){
      let dt = new Date();
      if(format =='year'){
        if(!end) dt.setMonth(0);
        else     dt.setMonth(11);
      }
      if(format == 'year' || format == 'month'){
        if(!end) dt.setDate(1);
        else     dt.setDate(this.getMaxDate(dt.getFullYear(), dt.getMonth()));
      }
      if(format == 'week'){
        if(!end) while(dt.getDay() != 1) dt = new Date(dt.setDate(dt.getDate() - 1));
        else     while(dt.getDay() != 0) dt = new Date(dt.setDate(dt.getDate() + 1));
        
      }
      dt = new Date(dt.getTime() - dt.getTime() % 86400000);
      dt = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60000);
      if(end) dt = new Date(dt.getTime() + (24*60*60*1000))
      return dt;
    },
    getMaxDate(y, m) {
      if (m == 1) {
        return y%4 || (!(y%100) && y%400 ) ? 28 : 29;
      };
   
      return m===3 || m===5 || m===8 || m===10 ? 30 : 31;
    },
    toggleColumn(column) {
      if (this.column == column) {
        this.order = !this.order;
      } else {
        this.column = column;
        this.order = false;
      }
    },
    getData(flag) {
      if (!flag) {
        this.from = 0;
      }
      this.$http.post(`/api`, `method=GET-BILLINGS&column=${this.column}&order=${this.order}&from=${this.from}&limit=${this.limit}&text=${this.search}&start=${this.getTimeValue(this.start)}&end=${this.getTimeValue(this.end)}`)
      .then(res => {
        if (res.status == 200) {
          if (flag) this.from += res.data.result.length;
          else      this.from = res.data.result.length;
          if (res.data.result.length < this.limit) this.pagination = false;
          else this.pagination = true;
          if(flag) this.transactions = this.transactions.concat(res.data.result);
          else     this.transactions = res.data.result;
        } else if (res.status == 204) { 
          this.pagination = false; 
          this.transactions = []; 
          this.from = 0;
        }
      })
      .catch(err => {
        console.error(err)
      })
    },
    getInfo(){
      this.getData();
      this.$http.post(`/api`, `method=PAYMENT-STATISTICS&start=${this.getTimeValue(this.start)}&end=${this.getTimeValue(this.end)}`)
      .then((res)=>{
        if(res.status === 200){
          let data = res.data;
          this.count = this.getSpaceInCount(data.amount || 0);
          this.operations = this.getSpaceInCount(data.length || 0);
        }else{
          console.warn(res.status)
        }
      })
      .catch((err)=>{
        console.error(err)
      })
    },
    getTimeValue(time){
      return time ? new Date(time).valueOf() : '';
    },
    getGraphInfo(start, end){
      this.$http.post(`/api`, `method=PAYMENT-STATISTICS&start=${start}&end=${end}`)
      .then((res)=>{
        if(res.status === 200){
          let data = res.data.data;
          let count = this.getSpaceInCount(data.amount || 0);
          let operations = this.getSpaceInCount(data.length);
          this.graph.push({count, operations});
          this.$set(this.graph[this.graph.length - 1], 'focus', false)
        }else{
          console.warn(res.status)
        }
      })
      .catch((err)=>{
        console.error(err)
      })
    },
    getSpaceInCount(amount){
      let count = '';
      amount = String(amount);
      while(amount.length >= 3){
        for (var i = 0; i < 3; i++) {
          count += amount.substring(amount.length, amount.length - 1);
          amount = amount.substring(0, amount.length - 1);
        }
        count += ' ';
      }
      if(amount.length) count += amount + ' ';
      let end = '';
      for(let i = count.length - 1; i >= 0; i--)
        end += count.charAt(i);
      return end + ' ';
    }
  }
}
</script>

<!-- <style src="@/assets/styles/pages/billing.css" scoped></style> -->
<style type="text/css" scoped>
  .between{
    border-bottom: 1.5px solid #dadada;
    text-align: center;
    cursor: pointer;
  }
  .between__activ{
    color: #009688;
    border-color: #009688;
  }
  .text-cent{
    text-align: center;
    cursor: pointer;
  }
  .about_transaction{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1.5px solid #dadada;
  }
  .graph{
    height: 300px;
    padding: 20px 0;
    display: flex;
    align-items: flex-end;
    width: 100%;
  }
  .tower{
    width: calc(100% / 7);
    min-width: 20px;
    min-height: 1px;
    background-color: #009688;
    transition: 0.3s;
    margin: 0 5px;
    position: relative;
  }
  .tower:hover{
    background-color: #24bbad;
    cursor: help;
  }
  .tower_focus{
    position: absolute;
    left: -85px;
    top: 5px;
    height: 100px;
    width: 100px;
    background-color: #fff;
    border: 1px solid #009688;
  }
  .tower_name{
    position: absolute;
    bottom: -20px;
    text-align: center;
    width: 100%;
  }
</style>