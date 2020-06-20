<template>
  <div id="app">
      <v-header v-if = "showComponent"></v-header>
      <v-sidebar v-if = "showComponent"></v-sidebar>
      <main v-bind:class="{ 'app-content' : showComponent }">
        <router-view/>
      </main>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import '@/assets/styles/main.css'

export default {
  name: 'App',
  components: {
    vHeader: Header,
    vSidebar: Sidebar
  },
  computed: {
    showComponent: function () {
      return this.$route.path != '/login'? true : false;
    }
  }
}
</script>

