<template>
  <v-app>
    <Chat :messages="messages" :user="user" :filename="filename"></Chat>
  </v-app>
</template>

<script>
import Chat from './components/Chat.vue';

export default {
  components: { Chat },
  data: () => ({
    filename: 'log.txt',
    user: 'Bob',
    messages: [
      {
        content: 'hi',
        from: 'Alice',
        isPreviousSender: false,
        time: '6:66 PM',
      },
      {
        content: 'is this a test',
        from: 'Alice',
        isPreviousSender: true,
        time: '6:66 PM',
      },
      {
        content: 'new fone who dis',
        from: 'Bob',
        isPreviousSender: false,
        time: '6:66 PM',
      },
    ],
  }),
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
