<template>
	<transition name="fade">
        <div class="content" v-if="block_id == 33 || block_id == 34">
            <p class="page_title">ЗАДАНИЯ</p>
            <div class="block_homeworks" :class="{'zix':block_id == 33}">
                <div class="home_head">
                    <span class="home_title">Домашнее задание: Урок 1</span>
                </div>
                <div class="home_body">
                    <div class="img_video">
                        <img :src="$tutorialUrl+'images/1024x576-STUDY-GROUP.jpg'" class="home_img">
                        <video class="home_img" controls :src="$tutorialUrl+'video/video.mp4'"></video>
                        <img :src="$tutorialUrl+'images/1024x576-STUDY-GROUP.jpg'" class="home_img">
                        <img :src="$tutorialUrl+'images/1024x576-STUDY-GROUP.jpg'" class="home_img">
                        <img :src="$tutorialUrl+'images/1024x576-STUDY-GROUP.jpg'" class="home_img">
                        <img :src="$tutorialUrl+'images/1024x576-STUDY-GROUP.jpg'" class="home_img">
                    </div>
                    <div class="other_files">
                        <div class="text_home">
                            <p>Задание 1. Закончите предложения, поставив глагол в скобках в Past Perfect.1. When a student entered the classroom, the lesson ... already.... (start); 2. It was his ﬁrst ﬂight, he ... never ... before. (ﬂy); 3. By the time we got to the cinema, the ﬁlm...already.... (ﬁnish); 4. Whenparents came back home, children... already ... to sleep. (go)</p>
                        </div>

                        <div class="audio_row">
                            <div class="audio_home">
                                <div class="voicePlay"><img :src="$tutorialUrl+'images/play.png'" class="playPause"></div>
                                <p class="audio_time">00:06</p>
                                <div class="lengthAudio">
                                    <div class="duration"></div>
                                </div>
                            </div>
                            <div class="audio_home">
                                <div class="voicePlay"><img :src="$tutorialUrl+'images/play.png'" class="playPause"></div>
                                <p class="audio_time">09:54</p>
                                <div class="lengthAudio">
                                    <div class="duration"></div>
                                </div>
                            </div>
                        </div>

                        <div class="document_row">
                            <div class="document">
                                <img :src="$tutorialUrl+'images/Doc_icon.png'" class="doc_icon">
                                <span class="document_name">Найти ошибки.docx</span>    
                            </div>
                            <div class="document">
                                <img :src="$tutorialUrl+'images/Doc_icon.png'" class="doc_icon">
                                <span class="document_name">Задание.docx</span>    
                            </div>
                        </div>

                    </div>
                </div>
                <div class="home_foot">
                    <button class="btn_send_home">Сдать ответы</button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
	name: 'homework',
	data () {
		return {
			
		}
	},
	props: ['block_id']
}
</script>
<style>
  @import url(../../../assets/tutorial_styles/homework.css);
</style>