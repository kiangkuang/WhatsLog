<template>
  <div class="conversation">
    <div class="conversation-container">
      <Message v-for="(msg, index) in messages" :key="index" :message="msg" :user="user"></Message>
    </div>
    <Compose></Compose>
  </div>
</template>

<script>
import Message from './Message.vue';
import Compose from './Compose.vue';

export default {
  components: { Message, Compose },
  props: {
    user: String,
    messages: Array,
  },
};
</script>

<style scoped>
.conversation {
  height: calc(100% - 55px);
  position: relative;
  background: #efe7dd url("https://cloud.githubusercontent.com/assets/398893/15136779/4e765036-1639-11e6-9201-67e728e86f39.jpg") repeat;
  z-index: 0;
}

.conversation ::-webkit-scrollbar {
  transition: all .5s;
  width: 5px;
  height: 1px;
  z-index: 10;
}

.conversation ::-webkit-scrollbar-track {
  background: transparent;
}

.conversation ::-webkit-scrollbar-thumb {
  background: #b3ada7;
}

.conversation .conversation-container {
  height: calc(100% - 68px);
  box-shadow: inset 0 10px 10px -10px #000000;
  overflow-x: hidden;
  padding: 0 16px;
  margin-bottom: 5px;
}

.conversation .conversation-container:after {
  content: "";
  display: table;
  clear: both;
}

/* Small Screens */

@media (max-width: 768px) {
  .conversation {
    height: calc(100vh - 55px);
  }
  .conversation .conversation-container {
    height: calc(100vh - 120px);
  }
}
</style>
