<template>
  <div class="message-group">
    <template v-if="group.showDateSeparator || group.messages[0]?.isSystem">
      <div
        v-for="(chip, chipIndex) in [
          ...(group.showDateSeparator ? [group.date] : []),
          ...(group.messages[0]?.isSystem ? group.messages.map(m => m.text) : [])
        ]"
        :key="`chip-${chipIndex}`"
        class="row justify-center q-my-md"
      >
        <q-chip
          color="grey-4"
          text-color="grey-8"
          size="md"
          square
        >
          {{ chip }}
        </q-chip>
      </div>
    </template>
    <template v-else>
      <q-chat-message
        v-for="(msg, msgIndex) in group.messages"
        :key="`msg-${msgIndex}`"
        :stamp="msgIndex === group.messages.length - 1 ? msg.timestamp : undefined"
        :sent="group.sender === currentPov"
        :bg-color="group.sender === currentPov ? 'light-green-4' : 'white'"
      >
        <template v-if="msgIndex === 0" #name>
          <span :style="{ color: getSenderColor(group.sender), fontWeight: 'bold' }">
            {{ group.sender }}
          </span>
        </template>
        <div v-if="msg.mediaUrl && msg.mediaType === 'image'">
          <q-img
            :src="msg.mediaUrl"
            style="min-width: 300px; max-width: 400px; border-radius: 8px"
            fit="contain"
          />
        </div>
        <div v-else-if="msg.mediaUrl && msg.mediaType === 'video'">
          <video
            :src="msg.mediaUrl"
            controls
            style="min-width: 300px; max-width: 400px; border-radius: 8px"
          />
        </div>
        <div v-else v-html="linkifyText(msg.text)"></div>
      </q-chat-message>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { GroupedMessage } from '../types/message'
import { linkifyText } from '../utils/linkify'

defineProps<{
  group: GroupedMessage
  currentPov: string
  getSenderColor: (sender: string) => string
}>()
</script>

<style scoped>
:deep(.q-message) {
  margin-bottom: 2px;
}

:deep(.q-message-stamp) {
  text-align: right;
}

:deep(.q-message-text:last-child) {
  min-height: auto;
}

.message-group :deep(.q-message:not(:last-child) .q-message-text:last-child::before) {
  display: none;
}
</style>
