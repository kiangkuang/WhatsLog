<template>
  <div class="chat">
    <div class="chat-container">
      <UserBar :filename="filename"></UserBar>
      <Conversation :messages="messages" :user="user"></Conversation>
    </div>
  </div>
</template>

<script>
import UserBar from './UserBar.vue';
import Conversation from './Conversation.vue';

export default {
  components: { UserBar, Conversation },
  props: {
    user: String,
    messages: Array,
    filename: String,
  },
};
</script>

<style scoped>
.chat {
  height: 100%;
}

.chat-container {
  height: 100%;
}
</style>
