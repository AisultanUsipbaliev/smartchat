<template>
	<transition name="fade">
        <div class="content" v-if="block_id == 35 || block_id == 36">
        <p class="page_title">ОБРАТНАЯ СВЯЗЬ</p>
            <div class="block_feed" :class="{'zix':block_id == 36}">
                <div class="feed">
                    <div class="feed_head">
                        <p>Обратная связь</p>
                    </div>
                    <div class="feed_body">
                        <p class="about_feed">Возникли трудности в работе с системой?<br> Нашли ошибку или хотите оставить отзыв?<br> Сообщите нам и отправьте скриншот.</p>
                        <div id="div_for_img">
                        <textarea id="text_feed" class="non_scroll" placeholder="Оставьте комментарии..."></textarea>
                        <div id="img_load">
                            <input type="file" title="" onchange="loadImg(event)" class="input_load" accept="image/*">
                            <span class="load_screen"><img :src="$tutorialUrl+'images/cam.png'" class="cam_load">Загрузить скриншот</span>
                        </div>
                        </div>
                    </div>
                    <div class="feed_foot">
                        <button class="btn_feed">Отправить</button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'feedback',
    data () {
        return {
            
        }
    },
    props: ['block_id']
}
</script>
<style scoped>
  @import url(../../../assets/tutorial_styles/feedback.css);
</style>