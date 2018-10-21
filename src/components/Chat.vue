<template>
  <div class="chat">
    <div class="chat-container">
      <UserBar/>
      <Conversation/>
    </div>
  </div>
</template>

<script>
import UserBar from './UserBar.vue';
import Conversation from './Conversation.vue';

export default {
  components: { UserBar, Conversation },
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
