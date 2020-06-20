<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card__header">
            <!-- <h2 class="col-sm-8">Тариф: {{rate.rate_name}}</h2> -->
            <h2 class="col-sm-8">Редактирование тарифа</h2>
            <ul class="card__action">
              <li>
                <a href="#;"><fai icon="expand-arrows-alt"/></a>
              </li>
            </ul>
          </div>
          <div class="card__body">
          	<div class="row">
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-3">Название: *</span>
				      	<textarea-autosize class="input col-sm-5" placeholder="Новый тариф" v-model="rate.rate_name"></textarea-autosize>
				      </div>
<!-- 				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-3">Описание: *</span>
				      	<textarea-autosize class="input col-sm-5" placeholder="Краткое описание тарифа" v-model="rate.rate_content"></textarea-autosize>
				      </div> -->
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-3">Описание: *</span>
				      	<textarea-autosize class="input col-sm-5" placeholder="Этот текст покажется студенту при навидении на тариф" v-model="rate.rate_title"></textarea-autosize>
				      </div>
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-3">Количество занятий: *</span>
				      	<input type="number" placeholder="0" class="input col-sm-1 px-0 rateContent" min="1" v-model="rate.lessons">
				      </div>
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<div class="col-sm-4">
				      		<span class="row" style="text-align: center;">Старая стоимость:</span>
					      	<input type="number" placeholder="0" class="input col-sm-6 rateContent" min="0" step="100" v-model="rate.oldCost">
					      </div>
					      <div class="col-sm-4">
					      	<span class="row" style="text-align: center;">Новая стоимость: *</span>
					      	<input type="number" placeholder="0" class="input col-sm-6 rateContent" min="0" step="100" v-model="rate.rate_cost">
				      	</div>
				      	<div class="col-sm-4 justify-content-start d-flex align-items-center">
					      	<span class="row mr-2" style="text-align: center;">Скидка:</span>
					      	<input type="checkbox" class="input col-sm-1 rateContent" v-model="rate.sale">
					      </div>
				      </div>
				      <div class="col-lg-12 d-flex justify-content-between align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-3">Картинка:</span>
				      	<label for="lieFile">
				      		<img class="rateImg" :src="rate.preImage ? rate.preImage : $commonFilesUrl + rate.image" v-if="rate.image">
				      		<span v-else class="input">Загрузить</span>
				      	</label>
				      </div>
				    </div>
          </div>
          <div class="card__footer">
            <ul class="card__action">
              <li>
              	<router-link to="/rate" class="btn">Отменить</router-link>
              	<div class="btn" @click="saveRate()">Сохранить</div>
              </li>
            </ul>
          </div>
        </div>
	    </div>
    </div>
    <input @change="uploadPhoto" type="file" class="lieFile" id="lieFile" accept="image/*">
  </div>
</template>

<script>
export default {
  name: 'RateDetail',
  data () {
    return {
      rate: {
      	rate_id: '',
      	rate_name: '',
      	rate_content: '',
      	rate_title: '',
      	rate_cost: '',
      	lessons: '',
      	oldCost: '',
      	sale: '',
      	image: '',
      	preImage: '',
      },
      newFile: '',
      fileName: '',
    }
  },
  created(){
  	let id = Number(this.$route.params.id)
		if(Number.isInteger(id))
	  	this.getData(id)
  },
  methods:{
  	getData(id){
  		this.$http.post(`/api`, `method=GET-RATE&rate_id=${id}`)
      .then(res => {
      	this.rate = res.data.rate;
      	this.fileName = res.data.rate.image
      })
      .catch(err => {})
  	},
  	uploadPhoto(e){
  		let name = e.target.files[0].name.split('.');
			name[name.length - 2] += new Date().valueOf() + '.';
			let a = '';
			for(let i = 0; i < name.length; i++)
				a += name[i];
			this.fileName = a;
  		this.rate.image = a;
  		this.rate.preImage = URL.createObjectURL(e.target.files[0]);
  		this.newFile = e.target.files[0];
  	},
  	saveRate(){
  		if(!this.newFile){
  			let rate = this.rate;
		  	if(rate.rate_cost === '') rate.rate_cost = rate.oldCost;
		  	this.$http.post(`/api`, `method=CREATE-OR-UPDATE-RATE&rate_name=${rate.rate_name}&rate_content=${rate.rate_content}&rate_title=${rate.rate_title}&rate_cost=${rate.rate_cost}&lessons=${rate.lessons}&rate_id=${rate.rate_id}&old_cost=${rate.oldCost}&sale=${rate.sale ? 1 : 0}&image=${this.fileName}`)
		      .then(res => {
		      	if(res.status === 200 || res.status === 204){
			        this.$swal({
		            type: 'success',
		            title: 'Успешно!',
		            text: `Тариф успешно сохранён`,
		            buttonsStyling: false,
		            confirmButtonClass: 'swal-btn swal-btn__confirm'
		          });
			      	this.$router.push({path:"/rate"}) 
			      }else
			      		this.$swal({
				          type: 'error',
				          title: 'Ошибка!',
				          text: `Заполните все обязательные поля`,
				          buttonsStyling: false,
				          confirmButtonClass: 'swal-btn swal-btn__confirm'
				        });
		      })
		      .catch(err => {
		      	this.$swal({
		          type: 'error',
		          title: 'Ошибка!',
		          text: `Заполните все обязательные поля`,
		          buttonsStyling: false,
		          confirmButtonClass: 'swal-btn swal-btn__confirm'
		        });
		      })
  		}else{

	  		let formData = new FormData();
	  		formData.append('uploadFile', this.newFile);
			  formData.append('method', 'UPLOAD-FILE');
			  formData.append('fileName', this.fileName);
			  const options = {
			    method: 'POST',
			    headers: { 'content-type': 'application/form-data' },
			    data: formData,
			    url: '/api',
			  };
			  this.$http(options).then(res => {
			  	let rate = this.rate;
			  	if(rate.rate_cost === '') rate.rate_cost = rate.oldCost;
			  	this.$http.post(`/api`, `method=CREATE-OR-UPDATE-RATE&rate_name=${rate.rate_name}&rate_content=${rate.rate_content}&rate_title=${rate.rate_title}&rate_cost=${rate.rate_cost}&lessons=${rate.lessons}&rate_id=${rate.rate_id}&old_cost=${rate.oldCost}&sale=${rate.sale ? 1 : 0}&image=${this.fileName}`)
			      .then(res => {
			      	if(res.status === 200 || res.status === 204){
				        this.$swal({
			            type: 'success',
			            title: 'Успешно!',
			            text: `Тариф успешно сохранён`,
			            buttonsStyling: false,
			            confirmButtonClass: 'swal-btn swal-btn__confirm'
			          });
				      	this.$router.push({path:"/rate"})
			      	}else
			      		this.$swal({
				          type: 'error',
				          title: 'Ошибка!',
				          text: `Заполните все обязательные поля`,
				          buttonsStyling: false,
				          confirmButtonClass: 'swal-btn swal-btn__confirm'
				        });
			      })
			      .catch(err => {
			      	this.$swal({
			          type: 'error',
			          title: 'Ошибка!',
			          text: `Заполните все обязательные поля`,
			          buttonsStyling: false,
			          confirmButtonClass: 'swal-btn swal-btn__confirm'
			        });
			      })
			  })
			  .catch(err => {
			  	this.$swal({
	          type: 'error',
	          title: 'Ошибка!',
	          text: `${err}`,
	          buttonsStyling: false,
	          confirmButtonClass: 'swal-btn swal-btn__confirm'
	        });
			  });
			}
  	}
  }
}
</script>

<style scoped>
	.bb{
		border-bottom: 1px solid #dadada !important;
	}
	.rateContent{
		overflow-wrap: break-word;
		white-space: normal;
	}
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	    -webkit-appearance: none;
	    margin: 0;
	}

	input[type=number] {
	    -moz-appearance:textfield;
	}
	a.btn{
		color: #000;
	}
	div.btn{
		color: #009688;
	}
	.rateImg{
		max-height: 200px;
		cursor: pointer;
		border: 1px solid #dadada;
	}
	.lieFile{
		position: absolute;
		opacity: 0;
		top: -100vh;
	}
	span.input{
		cursor: pointer;
		transition: 0.3s;
	}
	span.input:hover{
		background-color: #009688;
		color: #fff;
	}
</style>