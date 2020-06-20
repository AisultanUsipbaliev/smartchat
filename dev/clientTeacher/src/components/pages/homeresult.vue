









<template>
	<div :class="$mq.phone ? 'content-mob' : 'content' " id="content" v-viewer="{movable: false}">
		<loading v-if="loader"></loading>
		<div class="home-result" ref="body">
			<div class="head-home-result">
				<div class="back-to-the-future">
					<router-link to="/homeresult"><fai icon="chevron-left" class="head-info-home-result"/></router-link>
					<span>{{homework.name}}</span>
				</div>
				<span>{{homework.score ? Math.round(homework.score * 10) + '%' : 'Не проверено'}}</span>
				<span class="student-name-home-result">{{homework.lastname}} {{homework.firstname}}</span>
			</div>
			<div class="body-home-result">
				<div class="my-question" v-for="(content, id) in homework.content" :id="'con' + id " @click="content.score_err ? content.score_err = false : ''">
					<div class="student-answer">
						<div class="flexim-box">
							<img src="/static/img/student.png" class="student-photo-answer" v-if="content.type === 2 || content.type > 5">
							<span class="droped-text" v-if="content.type === 1">{{content.content}}</span>
							<div class="droped-question" v-if="content.type === 2">
								<span>{{content.content.question}}</span>
								<div class="option-block" v-for="(answer, q) in content.content.answers">
									<span :style="content.content.correct === q ? content.content.correct === content.content.answer ? {color: '#0f0'}
																																																									 : {color: 'lightgreen'}
																										 					: content.content.answer === q ? {color: '#f00'}
																										 																				 : ''">
										{{$functions.getLetter(q+1)}})
									</span>
									<span class="input-option quest">{{answer.answer}}</span>
									<fai icon="check" style = 'color: green' v-if="content.content.correct == content.content.answer && content.content.answer == q"/>
									<fai icon="times" style = 'color: red' v-if="content.content.correct != content.content.answer && content.content.answer == q"/>
								</div>
							</div>
							 <div class="droped-pictures" v-if="content.type === 4" @touchend="(event)=>{event.stopPropagation()}">
								<div class="droped-img-block" v-for="(img, m) in content.content">
										<img view :src="$fileUrl + img.file" class="droped-img" v-if="img.type == 1">
										<video :src="$fileUrl + img.file" controls class="droped-img" v-if="img.type == 2"></video>
								</div>
							</div>
							<div class="droped-document" v-if="content.type === 5 || content.type === 8" @touchend="(event)=>{event.stopPropagation()}">
								<div class="droped-document-block" v-for="doc in content.content">
									<a :href="$fileUrl + doc.file" target="_blank" class="document-block-homies">
										<fai icon="file" class="doc-icon" />
										<div class="info-doc-added-hw">
											<span class="doci-name">{{doc.file}}</span>
											<span class="doci-size" v-if="doc.size">{{$functions.getSize(doc.size)}}</span>
										</div>
									</a>
								</div>
							</div>
							<span class="droped-text" v-if="content.type === 6">{{content.content}}</span>
							<div class="droped-image" v-if="content.type === 3 || content.type === 7" @touchend="(event)=>{event.stopPropagation()}">
								<audio-player :srcer="$fileUrl + content.content"></audio-player>
							</div>
							<div class="droped-video" v-if="content.type === 9" @touchend="(event)=>{event.stopPropagation()}">
								<video :src="$fileUrl + video" controls v-for="video in content.content" class="video-check"></video>
							</div>
							<div class="droped-pictures" v-if="content.type === 10" @touchend="(event)=>{event.stopPropagation()}">
								<div class="droped-img-block" v-for="img in content.content">
										<img view :src="$fileUrl + img" class="droped-img">
								</div>
							</div>
						</div>
						<div class="rate-home-result" v-if="content.type > 5 && !homework.score" :style="content.score_err ? {border: '1px solid #f11'} : ''">
							<span class="rate-home-title">Оцените ответ студента</span>
							<div style="display: flex;">
								<span class="rate-math" :class="i === content.value ? 'rate-active' : ''" v-for="i in 10" @click="getScore(content, i)">{{i}}</span>
							</div>
						</div>
						<div v-if = "homework.score && (content.type > 5 || content.type == 2)" class="rate-home-result">
								<span class="rate-home-title">Студент получил {{content.value}} баллов за этот ответ</span>
						</div>
					</div>
				</div>
				<div class="enter-button" v-if="!homework.score" @click="saveResult()">
					Подтвердить
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import audioPlayer from '@/components/partials/audio_player'
	import Vue from 'vue'
	export default{
		name: 'HomeResult',
		components:{
			audioPlayer,
		},
		data(){
			return{
				homework: [],
				loader: false,
				enter: false,
			}
		},
		watch:{
			['homework.content'](newDate, oldDate){
				let err = false;
				for(let i = 0; i < newDate.length; i++)
					if(newDate[i].type === 2 || newDate[i].type > 5)
						if(!newDate[i].score)
							err = true;
				if(!err){
					setTimeout(()=>this.$refs['body'].scrollTo({top: this.$refs['body'].scrollHeight, behavior: "smooth"}), 100)
					this.enter = true;
				}
			},
		},
		mounted(){
			this.getHomework()
		},
		methods:{
			saveResult(){
				let err = false;
				for(let i = 0; i < this.homework.content.length; i++){
					let content = this.homework.content[i];
					if(content.type === 2 || content.type > 5){
						content.score_err = content.value == undefined
						err = content.score_err
						top.location.href = '#'
						top.location.href += 'con' + i
						if(err ==  true) return;
					}
					this.$set(this.homework.content, i, content)
				}
				if(err) return;
				this.loader = true;
				this.$http.post('/api', `method=CHECK-QUIZ&result_id=${this.homework.id}&contents=${JSON.stringify(this.homework.content)}`)
				.then(res => { if(res.status === 200) this.$router.replace({ path: '/homeresult' })})
				.catch( err => {this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'CHECK-QUIZ'})} )
				.finally( () => {this.loader = false	} )
			},
			getScore(content, value){
				if(content.score_err) content.score_err = false;
				if(!content.value) Vue.set(content, 'value', value);
				else 							 content.value = value;
			},
			getHomework(){
				this.loader = true;
				this.$http.post('/api', `method=GET-QUIZ-RESULT&result_id=${this.$route.params.id}`)
				.then( res => {
					this.homework = res.data.result
				} )
				.catch( err => this.$store.dispatch('error/GET_DATA', {err, path: this.$route.name, str: 'GET-QUIZ-RESULT'}) )
				.finally( () => this.loader = false )
			},
		},
	}
</script>

<style>
	@import url(../../assets/css/homeworks.css);
</style>