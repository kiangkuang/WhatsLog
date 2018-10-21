<template>
  <v-app>
    <Chat/>
  </v-app>
</template>

<script>
import Chat from './components/Chat.vue';

export default {
  components: { Chat },
};
</script>

<style>
html {
  box-sizing: border-box;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "Roboto", sans-serif;
  margin: 0;
  padding: 0;
  height: 100%;
}

.application {
  height: 100%;
}
</style>
