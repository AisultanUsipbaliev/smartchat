<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card__header">
            <h2 class="col-sm-8">Тариф: {{rate}}</h2>
            <ul class="card__action">
              <li>
                <a href="#;"><fai icon="expand-arrows-alt"/></a>
              </li>
            </ul>
          </div>
          <div class="card__body">
          	<div class="row">
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-4">Название:</span>
				      	<textarea-autosize class="input col-sm-8" placeholder="Тариф1" v-model="rate.rate_name"></textarea-autosize>
				      </div>
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-4">Описание:</span>
				      	<textarea-autosize class="input col-sm-8" placeholder="Краткое описание тарифа" v-model="rate.rate_content"></textarea-autosize>
				      </div>
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-4">Надпись при наведении:</span>
				      	<textarea-autosize class="input col-sm-8" placeholder="Этот текст покажется студенту при навидении на тариф" v-model="rate.rate_title"></textarea-autosize>
				      </div>
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-4">Количество занятий:</span>
				      	<input type="number" placeholder="0" class="input col-sm-1 px-0 rateContent" min="1" v-model="rate.lessons">
				      </div>
				      <div class="col-lg-12 d-flex justify-content-start align-items-center mb-3 pb-2 bb">
				      	<div class="col-sm-4">
				      		<span class="row" style="text-align: center;">{{rate.sale ? 'Старая стоимость:' : 'Стоимость:'}}</span>
					      	<input type="number" placeholder="0" class="input col-sm-6 rateContent" min="0" step="100" v-model="rate.oldCost">
					      </div>
				      	<div class="col-sm-4 justify-content-start d-flex align-items-center">
					      	<span class="row mr-2" style="text-align: center;">Скидка:</span>
					      	<input type="checkbox" class="input col-sm-1 rateContent" v-model="rate.sale">
					      </div>
					      <div class="col-sm-4" v-if="rate.sale">
					      	<span class="row" style="text-align: center;">Стоимость со скидкой:</span>
					      	<input type="number" placeholder="0" class="input col-sm-6 rateContent" min="0" step="100" v-model="rate.rate_cost">
				      	</div>
				      </div>
				      <div class="col-lg-12 d-flex justify-content-between align-items-center mb-3 pb-2 bb">
				      	<span class="col-sm-4">Картинка:</span>
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
              	<div class="btn" @click="saveRate()">Сохранить</div>
              	<router-link to="/rate" class="btn" @click="">Отменить</router-link>
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
  	this.getData(this.$route.params.id)
  },
  methods:{
  	getData(id){
  		this.$http.post(`/rate`, `method=GET-RATE&rate_id=${id}`)
      .then(res => {
      	this.rate = res.data.rate[0];
      	console.log(this.rate)
      })
      .catch(err => {})
  	},
  	uploadPhoto(e){
  		let name = e.target.files[0].name.split('.');
			name[name.length - 2] += new Date().valueOf() + '.';
			let a = '';
			for(let i = 0; i < name.length; i++)
				a += name[i];
			console.log(a)
			this.fileName = a;
  		this.rate.image = a;
  		this.rate.preImage = URL.createObjectURL(e.target.files[0]);
  		this.newFile = e.target.files[0];
  	},
  	saveRate(){
  		let formData = new FormData();
  		formData.append('uploadFile', this.newFile);
		  formData.append('method', 'UPLOAD-PHOTO');
		  formData.append('fileName', this.fileName);
		  const options = {
		    method: 'POST',
		    headers: { 'content-type': 'application/form-data' },
		    data: formData,
		    url: '/rate',
		  };
		  this.$http(options).then(res => {
		  	let rate = [];
		  	rate[0] = this.rate;
		  	if(rate[0].rate_cost === '') rate[0].rate_cost = rate[0].oldCost;
		  	this.$http.post(`/rate`, `method=NEW-RATE&rate=${JSON.stringify(rate)}`)
		      .then(res => {
		      	this.$router.push({path:"/rate"})
		      })
		      .catch(err => {
		      	console.error(err)
		      })
		  })
		  .catch(err => console.error(err));
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