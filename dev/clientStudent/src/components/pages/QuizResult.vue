<template>
	<div class="content">
		<div class="quiz-block">
			<div class="quiz-infohead">
				<div class="quiz-name">Задание: {{quizes.name}}</div>
				<div class="quiz-name">{{quizes.score ? Math.round(quizes.score * 10) + '%' : 'Не проверено'}}</div>
				<div class="quiz-level">Уровень: {{getLevel(quizes.level)}}</div>
			</div>
			<div class="quiz-body">
				<div class="droped-block" v-for="(content, q) in quizes.completed" :key="q">
					<div class="text-quiz-block block-q" v-if="content.type == 1">
						<p class="text-quiz-teacher">{{content.content}}</p>
					</div>
					<div class="text-quiz-block block-q" v-if="content.type == 2">
						<img :src="student.ava? student.ava:ava_replace" class="mine-content">
						<span class="question-in-block">Вопрос: {{content.content.question}}</span>
						<label :for="'id' + a" v-for="(answers, a) in content.content.answers" :key='a' class="answer-row-hw">
							<span>{{answers.answer}}</span>
							<span v-if="content.content.answer == a && content.content.answer == content.content.correct" style="color: green;"><fai icon="check"/></span>
							<span v-if="content.content.answer != a && a == content.content.correct" style="color: green;"><fai icon="check"/></span>
							<span v-if="content.content.answer == a && content.content.answer != content.content.correct" style="color: red;"><fai icon="times"/></span> 
						</label>
						<span class="value-quiz">{{content.value ? 'За этот ответ вы получили ' + Number(content.value*10)+'%' : ''}}</span>
					</div>
					<div class="teacher-audio-block block-q" v-if="content.type == 3">
						<div class="audios">
							<span v-for="url in content.content">
								<audio-player class="" :srcer="$fileUrl+url" ></audio-player>
							</span>
						</div>
					</div>
					<div class="block-q" v-if="content.type == 4"  v-viewer="{movable: false}" > 
						<div class="gallery-block">
							<div class="item-gb" v-for="img in content.content">
								<img :src="$fileUrl + img.file" class="image-quiz" v-if="img.type == 1" view>
								<video :src="$fileUrl + img.file" class="image-quiz" v-if="img.type == 2" controls></video>
							</div>
						</div> 
					</div>
					<div class="quiz-document-block block-q" v-if="content.type == 5">
						<div class="doc-block">
							<a download="true" class="downloadFile" target="_blank" v-for="doc in content.content" :href="$fileUrl + doc.file">
								<fai icon="file" class="doc-icon"/>
								<div class="doc-info">
									<span class="doc-name">{{doc.name}}</span>
									<span class="doc-size">{{getSize(doc.size)}}</span>
								</div>
							</a>
						</div>
					</div>
					<div class="text-student-block block-q" v-if="content.type == 6">
						<img :src="student.ava? student.ava:ava_replace" class="mine-content">
						<p class="text-quiz-teacher">{{content.content}}</p>
						<span class="value-quiz">{{content.value ? 'За этот ответ вы получили ' + Number(content.value*10)+'%' : ''}}</span>
					</div>
					<div class="audio-student-block block-q" v-if="content.type == 7">
						<img :src="student.ava? student.ava:ava_replace" class="mine-content">
						<div class="audios">
							<span v-for="url in content.content">
								<audio-player class="" :srcer="$fileUrl+url" ></audio-player>
							</span>
						</div>
						<span class="value-quiz">{{content.value ? 'За этот ответ вы получили ' + Number(content.value*10)+'%' : ''}}</span>
					</div>
					<div class="document-student-block block-q" v-if="content.type == 8">
						<img :src="student.ava? student.ava:ava_replace" class="mine-content">
						<div class="documents-quiz">
							<a target="_blank" :href="$fileUrl+doc.file" class="downloadFile" v-for="(doc, m) in content.content">
								<fai icon="file" class="doc-icon"/>
								<div class="doc-info">
									<span class="add-doc-name">{{doc.name}}</span>
									<span class="doc-size">{{getSize(doc.size)}}</span>
								</div>
							</a>
						</div>
						<span class="value-quiz">{{content.value ? 'За этот ответ вы получили ' + Number(content.value*10)+'%' : ''}}</span>
					</div>
					<div class="text-student-block block-q" v-if="content.type == 9">
						<img :src="student.ava? student.ava:ava_replace" class="mine-content">
						<div class="gallery-student">
							<div class="videoblock" v-for="(video, v) in content.content">
								<video :src="$fileUrl+video" class="videodrop" controls></video>
							</div>
						</div>
						<span class="value-quiz">{{content.value ? 'За этот ответ вы получили ' + Number(content.value*10)+'%' : ''}}</span>
					</div>
					<div class="text-student-block block-q" v-if="content.type == 10" v-viewer="{movable: false}">
						<img :src="student.ava? student.ava:ava_replace" class="mine-content">
						<div class="gallery-student">
							<div class="pictureblock" v-for="picture in content.content">
								<img :src="$fileUrl+picture" class="picturedrop" view>
							</div>
						</div>
						<span class="value-quiz">{{content.value ? 'За этот ответ вы получили ' + Number(content.value*10)+'%' : ''}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import audioPlayer from '@/components/partials/audio_player' 
	export default{
		name: 'QuizResult',
		components:{
			audioPlayer,
		},
		data(){
			return {
				quizes: '',
				quizId: 0,
				recording: false,
				playing: false,
				student: ''
			}
		},
		computed: {
			allInfo() {
		    return this.$store.getters['user/ALL'];
		  },
		},
		watch: {
    	allInfo (newData) {
 			this.student = newData.user;
    	}
  	},
		created(){
			this.quizId = this.$route.query.id
			if(!this.quizId) top.location.href = '/quizlist'
			this.student = this.$store.getters['user/ALL'].user;

			this.$http.post('/api', `method=GET-QUIZ&&quizId=${this.quizId}`)
			.then(res => {
				this.quizes = res.data.quiz
			})
			.catch(err => {
				console.log(err)
			})

			// this.quizes = {
			// 	name: 'test',
			// 	level: 1,
			// 	value: 0,
			// 	completed:
			// 	[
			// 		{
			// 			type: 1,
			// 			content: 'Lorem ipsum'
			// 		},
			// 		{
			// 			type: 2,
			// 			content: {
			// 				question: 'Question in fucking block. To be or not to be',
			// 				correct: 0,
			// 				answers: [{answer: 'To be'}, {answer: 'Not to be'},{answer:  'Иди нахуй'}],
			// 				answer: 0
			// 			},
			// 			value: 10
			// 		},
			// 		{
			// 			type: 3,
			// 			file: ['253197be2cf3-----v1554430680226-----v.mp3','253197be2cf3-----v1554430680226-----v.mp3']		
			// 		},
			// 		{
			// 			type: 		4,
			// 			content: 	[
			// 				{
			// 					file: '151829751116436853121554690365159.jpg',
			// 					type: 1
			// 				},
			// 				{
			// 					file: '151829751116436853121554690365159.jpg',
			// 					type: 1
			// 				},
			// 				{
			// 					file: 'd271948afb720-----v1555307158333-----v.mp4',
			// 					type: 2
			// 				},
			// 				{
			// 					file: '151829751116436853121554690365159.jpg',
			// 					type: 1
			// 				},
			// 				{
			// 					file: '151829751116436853121554690365159.jpg',
			// 					type: 1
			// 				},
			// 				{
			// 					file: 'blob:http://185.146.2.146:2020/0930a391-f2df-4f55-90e8-1ccadc1d6446',
			// 					type: 2
			// 				},
			// 			]
			// 		},
			// 		{
			// 			type: 5,
			// 			content: [
			// 				{
			// 					name: 'Это то, что будет видеть пользователь',
			// 					size: 11380789,
			// 					file: '253197be2cf3-----v1554430680226-----v.mp3',
			// 				},
			// 				{
			// 					name: 'Говно собачье',
			// 					size: 0,
			// 					file: 'd271948afb720-----v1555307158333-----v.mp4',
			// 				},
			// 			]		
			// 		},
			// 		{
			// 			type: 6,
			// 			content: ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates sequi, sunt ducimus adipisci, iusto repellat. Impedit, error dolorum eveniet! Fugiat, numquam maiores veritatis esse unde veniam voluptates, repellat deserunt, quaerat magni alias sed inventore quas, est voluptate temporibus obcaecati possimus.',
			// 			value: 0

			// 		},
			// 		{
			// 			type: 7,
			// 			content: ['253197be2cf3-----v1554430680226-----v.mp3'],
			// 			value: 10
			// 		},
			// 		{
			// 			type: 8,
			// 			content: [
			// 				{
			// 					name: 'Это то, что будет видеть пользователь',
			// 					size: 11380789,
			// 					file: '253197be2cf3-----v1554430680226-----v.mp3',
			// 				},
			// 				{
			// 					name: 'Говно собачье',
			// 					size: 11380789,
			// 					file: 'd271948afb720-----v1555307158333-----v.mp4',
			// 				},
			// 			],
			// 			value: 0
			// 		},
			// 		{
			// 			type: 9,
			// 			content: ['d271948afb720-----v1555307158333-----v.mp4'],
			// 			value: 0
			// 		},
			// 		{
			// 			type: 10,
			// 			content: 	['151829751116436853121554690365159.jpg'],
			// 			value: 0
			// 		},
			// 	],
			// }
		},
		methods:{
			getLevel(lvl){
				switch(lvl){
					case 1: return 'Beginner';
					case 2: return 'Pre-Intermaediate';
				}
			},
			getSize(size){
			  let sizeN = 0;
			  if(size >= 1024000){
			    while(size >= 1024000){
			      size -=1024000;
			      sizeN++;
			    }
			    size = `\'${size}\'`;
			    sizeN += '.' + size[1] + size[2]
			    sizeN +='Mb'
			  }else{
			    while(size >= 1024){
			      size -=1024;
			      sizeN++;
			    }
			    sizeN +='Kb'
			  }
			  return sizeN;
			}
		}
	}
</script>

<style type="text/css" scoped>
  @import url(../../assets/styles/pages/web/quiz.css);
</style>