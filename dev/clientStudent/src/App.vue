<template>
  <div id="app"> 
    <!-- <v-tutorial v-if="showComponent"></v-tutorial> -->
    <v-header v-if="!showComponent"></v-header>
    <main v-if="!showComponent">
      <router-view/>
    </main>
  </div>
</template>

<script>

import Header   from '@/components/partials/Header'
// import Tutorial   from '@/components/tutorial'

export default {
  name: 'App',
  components: {
    vHeader: Header,
    // vTutorial: Tutorial
  },
  created(){
    // this.$webAudioTouchUnlock(this.$context)
    // .then((unlocked) => {console.log('Unlock: ', unlocked);},(err) => {})
  },
  computed: {
    showComponent: function () {
      if (this.$route.path == '/tutorial') return true
      else return false
    }
  }
}
</script>

<style type="text/css">
  @import url(./assets/styles/mobile.css) (max-width: 768px);
  @import url(./assets/styles/web.css) (min-width: 768px);
  @import url(./assets/styles/components/need_feedback.css)
</style>