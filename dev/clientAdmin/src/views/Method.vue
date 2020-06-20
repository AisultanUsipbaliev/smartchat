<template>
  	<div class="content">
  		<div class="background" v-show="modal">
			<div class="change_popup">
				<div class="head_change">
					<i class="fa fa-home" title="Обозначить как домашнее задание"></i>
					<i class="fa fa-download" title="Загрузить файл"></i>
					<i class="fa fa-check-circle" title="Сохранить"></i>
					<i class="fa fa-close" @click="modal=false" title="Закрыть"></i>
				</div>

				<div class="body_change">

					<div class="text_content">
						<p class="title_body_change">Текст</p>
						<textarea id="text_content" class="form-control"></textarea>
					</div>

					<div class="img_content">
						<p class="title_body_change">Фотографии</p>
						<div class="images_in_add_methods">
							<div class="img">
								<div class="close_div"><i class="fa fa-close"></i></div>
								<img src="https://cs.pikabu.ru/post_img/2013/09/30/8/1380539322_97837330.jpg">
							</div>
							<div class="img">
								<div class="close_div"><i class="fa fa-close"></i></div>
								<img src="https://cs.pikabu.ru/post_img/2013/09/30/8/1380539322_97837330.jpg">
							</div>
						</div>
					</div>

					<div class="file_content">
						<p class="title_body_change">Файлы</p>
						<div class="documents_div">
							<div class="document_rounded">
								<div class="close_div"><i class="fa fa-close"></i></div>
								<div class="document">
									<i class="fa fa-file"></i>
									<span>6516846512165.zip</span>
								</div>
							</div>
						</div>
					</div>


					<div class="video_content">
						<p class="title_body_change">Видео</p>
						<div class="videos-div">
							<div class="video">
								<div class="close_div"><i class="fa fa-close"></i></div>
								<video class="videoplayer" controls src="https://r10---sn-n8v7znlr.googlevideo.com/videoplayback?ip=179.61.131.48&id=o-AKhg4bRUvNnJWLZ2--UNVHKtWYBqCOLVYC3IWQVjUmb8&requiressl=yes&dur=30.069&pl=24&ratebypass=yes&fvip=4&txp=2211222&ei=83ryW6OFMMqc1gK28JTIBA&c=WEB&source=youtube&mime=video%2Fmp4&itag=18&key=cms1&signature=7D043AFE15F8B3BA978530CC0B3276E2E8530642.3F259C2D5895952EA2524B1049074CC0E29252F4&gir=yes&clen=2357993&ipbits=0&expire=1542639443&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,nh,pl,ratebypass,requiressl,source&lmt=1539854146288409&video_id=lVAl9wGFmhM&title=%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B0+%D0%B8%D0%B7+%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B+Huawei+Mate+20+%E2%80%94+%D0%AD%D1%80%D0%B0+%D0%92%D1%8B%D1%81%D1%88%D0%B5%D0%B3%D0%BE+%D0%A0%D0%B0%D0%B7%D1%83%D0%BC%D0%B0+%282018%29&rm=sn-4g5e7k7z&fexp=23763603&req_id=a51687cf6b27a3ee&ipbypass=yes&mip=5.188.67.224&redirect_counter=2&cm2rm=sn-pivhx-n8vz7r&cms_redirect=yes&mm=29&mn=sn-n8v7znlr&ms=rdu&mt=1542617733&mv=m&nh=IgpwcjAyLnN2bzA2KgkxMjcuMC4wLjE" ></video>
							</div>
							<div class="video">
								<div class="close_div"><i class="fa fa-close"></i></div>
								<video class="videoplayer" controls src="https://r10---sn-n8v7znlr.googlevideo.com/videoplayback?ip=179.61.131.48&id=o-AKhg4bRUvNnJWLZ2--UNVHKtWYBqCOLVYC3IWQVjUmb8&requiressl=yes&dur=30.069&pl=24&ratebypass=yes&fvip=4&txp=2211222&ei=83ryW6OFMMqc1gK28JTIBA&c=WEB&source=youtube&mime=video%2Fmp4&itag=18&key=cms1&signature=7D043AFE15F8B3BA978530CC0B3276E2E8530642.3F259C2D5895952EA2524B1049074CC0E29252F4&gir=yes&clen=2357993&ipbits=0&expire=1542639443&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,nh,pl,ratebypass,requiressl,source&lmt=1539854146288409&video_id=lVAl9wGFmhM&title=%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B0+%D0%B8%D0%B7+%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B+Huawei+Mate+20+%E2%80%94+%D0%AD%D1%80%D0%B0+%D0%92%D1%8B%D1%81%D1%88%D0%B5%D0%B3%D0%BE+%D0%A0%D0%B0%D0%B7%D1%83%D0%BC%D0%B0+%282018%29&rm=sn-4g5e7k7z&fexp=23763603&req_id=a51687cf6b27a3ee&ipbypass=yes&mip=5.188.67.224&redirect_counter=2&cm2rm=sn-pivhx-n8vz7r&cms_redirect=yes&mm=29&mn=sn-n8v7znlr&ms=rdu&mt=1542617733&mv=m&nh=IgpwcjAyLnN2bzA2KgkxMjcuMC4wLjE" ></video>
							</div>
							<div class="video">
								<div class="close_div"><i class="fa fa-close"></i></div>
								<video class="videoplayer" controls src="https://r10---sn-n8v7znlr.googlevideo.com/videoplayback?ip=179.61.131.48&id=o-AKhg4bRUvNnJWLZ2--UNVHKtWYBqCOLVYC3IWQVjUmb8&requiressl=yes&dur=30.069&pl=24&ratebypass=yes&fvip=4&txp=2211222&ei=83ryW6OFMMqc1gK28JTIBA&c=WEB&source=youtube&mime=video%2Fmp4&itag=18&key=cms1&signature=7D043AFE15F8B3BA978530CC0B3276E2E8530642.3F259C2D5895952EA2524B1049074CC0E29252F4&gir=yes&clen=2357993&ipbits=0&expire=1542639443&sparams=clen,dur,ei,expire,gir,id,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,nh,pl,ratebypass,requiressl,source&lmt=1539854146288409&video_id=lVAl9wGFmhM&title=%D0%9C%D1%83%D0%B7%D1%8B%D0%BA%D0%B0+%D0%B8%D0%B7+%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B+Huawei+Mate+20+%E2%80%94+%D0%AD%D1%80%D0%B0+%D0%92%D1%8B%D1%81%D1%88%D0%B5%D0%B3%D0%BE+%D0%A0%D0%B0%D0%B7%D1%83%D0%BC%D0%B0+%282018%29&rm=sn-4g5e7k7z&fexp=23763603&req_id=a51687cf6b27a3ee&ipbypass=yes&mip=5.188.67.224&redirect_counter=2&cm2rm=sn-pivhx-n8vz7r&cms_redirect=yes&mm=29&mn=sn-n8v7znlr&ms=rdu&mt=1542617733&mv=m&nh=IgpwcjAyLnN2bzA2KgkxMjcuMC4wLjE" ></video>
							</div>
						</div>
					</div>

					<div class="audio_content">
						<p class="title_body_change">Аудио</p>
						<div class="audios">
							<div class="audio">
								<audio src="1.mp3" class="audioplayer" controls></audio>
								<i class="fa fa-close"></i>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="head_template">
			<div class="first_line p10">
				<p class="title_template">Выберите тариф</p>
				<input type="radio" id="first_line_1" class="input_r" name="first_line"><label for="first_line_1">Пробное занятие</label>
				<input type="radio" id="first_line_2" class="input_r" name="first_line"><label for="first_line_2">Индивидуально</label>
			</div>
			<div class="second_line p10 bor_t">
				<p class="title_template">Выберите уровень</p>
				<input type="radio" id="second_line_1" class="input_r" name="second_line"><label for="second_line_1">Beginner</label>
				<input type="radio" id="second_line_2" class="input_r" name="second_line"><label for="second_line_2">Elementary</label>
				<input type="radio" id="second_line_3" class="input_r" name="second_line"><label for="second_line_3">Pre-intermediate</label>
				<input type="radio" id="second_line_4" class="input_r" name="second_line"><label for="second_line_4">Intermediate</label>
				<input type="radio" id="second_line_5" class="input_r" name="second_line"><label for="second_line_5">Upper-intermediate</label>
				<input type="radio" id="second_line_6" class="input_r" name="second_line"><label for="second_line_6">Advanced</label>
				<input type="radio" id="second_line_7" class="input_r" name="second_line"><label for="second_line_7">Mastery</label>
			</div>
			<div class="third_line bor_t p10">
				<p class="title_template">Выберите урок</p>
				<input type="radio" id="third_line_1" class="input_r" name="third_line"><label for="third_line_1">Урок 1</label>
				<input type="radio" id="third_line_2" class="input_r" name="third_line"><label for="third_line_2">Урок 2</label>
				<input type="radio" id="third_line_3" class="input_r" name="third_line"><label for="third_line_3">Урок 3</label>
				<input type="radio" id="third_line_4" class="input_r" name="third_line"><label for="third_line_4">Урок 4</label>
				<input type="radio" id="third_line_5" class="input_r" name="third_line"><label for="third_line_5">Урок 5</label>
				<input type="radio" id="third_line_6" class="input_r" name="third_line"><label for="third_line_6">Урок 6</label>
				<input type="radio" id="third_line_7" class="input_r" name="third_line"><label for="third_line_7">Урок 7</label>
			</div>
		</div>

		<div class="body_template">
			<div class="methodic">
				<div class="count_methodic"><p>1</p><i class="fa fa-home"></i><i @click="methodics = !methodics" class="fa fa-cog">
					<div v-show="methodics" class="settings_methodics">
						<span><i class="fa fa-arrow-up"></i>Вверх</span>
						<span><i class="fa fa-arrow-down"></i>Вниз</span>
						<span @click="modal = !modal"><i class="fa fa-refresh"></i>Изменить</span>
						<span><i class="fa fa-trash"></i>Удалить</span>
					</div>
				</i></div>
				<p class="text_methodic">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde deleniti, magni laborum, dolore ad nisi, nemo corporis minima molestias, aliquid ab dignissimos. Dolorem veritatis ipsum reprehenderit natus, modi omnis harum.</p>	
				<div class="content_methodic">
					<img src="http://www.apicius.es/wp-content/uploads/2012/07/IMG-20120714-009211.jpg" class="methodics_con">
					<iframe class="methodics_con" src="https://www.youtube.com/embed/v1PeTDrw6OY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
					<img src="http://www.apicius.es/wp-content/uploads/2012/07/IMG-20120714-009211.jpg" class="methodics_con">
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Method',
  data () {
    return {
      msg: 'Method Page', methodics: false, modal: false

    }
  }
}
</script>


<style src="@/assets/styles/pages/method.css" scoped></style>