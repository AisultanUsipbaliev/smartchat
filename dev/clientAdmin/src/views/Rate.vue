<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card__header ">
            <h2>Список тарифов</h2>
            <ul class="card__action">
              <li>
                <a href="#;"><fai icon="expand-arrows-alt"/></a>
              </li>
            </ul>
          </div>
          <div class="card__body">
            <div class="table-filter-block">
              <div class="row">
                <div class="col-md-4 col-sm-6">
                  <label for="search">Поиск : </label>
                  <input id="search" type="text" v-on:keyup="getData()" v-model="search" placeholder="Введите текст" class="input form-control-sm">
                </div>
                <div class="col-md-4 col-sm-6"></div>
                <div class="col-md-4 col-sm-6 reverse">
                  <router-link class="input form-control-sm" :to="{ name:'RateDetail', params:{id:'new'} }">
                    <fai icon="plus-square" class="mr-2 "/>Добавить
                  </router-link>
                </div>

              </div>
            </div>
            <div class="table-responsive" v-dragscroll>
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
                    <th>Настройки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(rate, index) in rates" :key="index" :title="rate.rate_title">
                    <td v-if="rate.rate_id">
                      <router-link :to="{ name:'RateDetail', params:{id:rate.rate_id} }" class="table__link">{{rate.rate_name}}</router-link>
                    </td>
                    <td v-else>-</td>
                    <td class="rateContent" v-if="rate.rate_title">{{rate.rate_title}}</td>
                    <td v-else>-</td>
                    <td v-if="rate.lessons">{{rate.lessons}}</td>
                    <td v-else>-</td>
                    <td v-if="rate.rate_cost !== ''">
                    	<span class="oldCost">{{rate.oldCost}}Kzt<br></span>
	                    <span :class="{newCost: rate.sale}">{{rate.rate_cost}}Kzt</span>
	                  </td>
                    <td v-else>-</td>
                    <td  class="table__btn-container">
                      <button class="btn" :title="rate.active ? 'Блокировать' : 'Разблокировать'" @click="changeActivate(rate)">
                        <fai :icon="rate.active ? 'unlock' : 'lock'"/>
                      </button>
                      <button class="btn" title="Удалить"  @click="deleteRate(index)">
                        <fai icon="trash-alt"/>
                      </button>
                    </td>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rate',
  data () {
    return {
      head: [
        {
          name: 'Название',
          search: 2
        },
        {
          name: 'Описание',
          search: 0
        },
        {
          name: 'Уроков',
          search: 5
        },
        {
          name: 'Цена',
          search: 4
        }
      ],
    rates: [],
    order: true,
    column: 1,
    limit: 25,
    from: 0,
    pagination: false,
    search: '',
    }
  },
  created() {
    this.getData(true);
  },
  methods: {
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
      this.$http.post(`/api`, `method=GET-RATES&column=${this.column}&order=${this.order}&from=${this.from}&limit=${this.limit}&text=${this.search}`)
      .then(res => {
        if (res.status == 200) {
          if (flag) this.from += res.data.result.length;
          else      this.from = res.data.result.length;
          if (res.data.result.length < this.limit) this.pagination = false;
          else this.pagination = true;
          if(flag) this.rates = this.rates.concat(res.data.result);
          else     this.rates = res.data.result;
        } else if (res.status == 204) { 
          this.pagination = false; 
          this.rates = []; 
          this.from = 0;
        }
      })
      .catch(err => {
      	this.rates = [];
      })
    },
    deleteRate(index){
      let name = this.rates[index].rate_name;
      this.$swal({
        title: `Удалить курс ${name}?`,
        text: "Данная операция не обратима!",
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        buttonsStyling: false,
        confirmButtonClass: 'swal-btn swal-btn__confirm',
        cancelButtonClass: 'swal-btn swal-btn__cancel',
        confirmButtonText: 'Удалить!',
        cancelButtonText: 'Отмена!',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          return this.$http.post(`/api`, `method=DELETE-RATE&rate_id=${this.rates[index].rate_id}`)
          .then(response => { if (response.status != 200) { throw new Error(response.statusText); } })
          .catch(e => { throw new Error(response.statusText); })
        },
        allowOutsideClick: () => !this.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          this.$swal({
            type: 'success',
            title: 'Успешно!',
            text: `Курс ${name} удален`,
            buttonsStyling: false,
            confirmButtonClass: 'swal-btn swal-btn__confirm'
          });
          this.rates.splice(index, 1)
        }
      })
      .catch((error) => {
        this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${error}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })

    },
    changeActivate(rate){
    	if(rate.active == 0) rate.active = 1
  		else rate.active = 0;
    	this.$http.post(`/api`, `method=RATE-STATUS&rate_id=${rate.rate_id}&status=${rate.active}`)
      .then(res => {
        this.$swal({
          type: 'success',
          title: 'Успешно!',
          text: `Статус изменён`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
      .catch(err => {
	    	if(rate.active == 0) rate.active = 1
	  		else rate.active = 0;
      	this.$swal({
          type: 'error',
          title: 'Ошибка!',
          text: `${err}`,
          buttonsStyling: false,
          confirmButtonClass: 'swal-btn swal-btn__confirm'
        });
      })
    }
  }
}
</script>

<style scoped>
	.rateContent{
		max-width: 500px;
		overflow-wrap: break-word;
		white-space: normal;
	}
	.oldCost{
		text-decoration: line-through;
		color: #962323;
	}
	.newCost{
		color: #35b927;
	}
  .reverse{
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
  }
  .reverse>a{
    max-width: 150px;
    transition: 0.1s;
  }
  .reverse>a:hover{
    border-color: #009688;
    color: #009688;
  }
</style>