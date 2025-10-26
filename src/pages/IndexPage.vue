<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <q-card class="chat-container">
          <q-card-section class="bg-teal text-white q-pa-sm">
            <div class="row items-center justify-between">
              <div class="col">
                <div class="text-h6">{{ chatTitle }}</div>
                <div class="text-caption" v-if="participants.length">
                  {{ participants.join(', ') }}
                </div>
              </div>
              <div class="col-auto">
                <PovSelector
                  v-if="participants.length > 0"
                  v-model="currentPov"
                  :participants="participants"
                  :get-sender-color="getSenderColor"
                />
                <q-btn
                  flat
                  round
                  dense
                  icon="upload_file"
                  color="white"
                  @click="openFileDialog()"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-scroll-area
            class="bg-grey-3"
            :style="{ height: 'calc(100vh - 100px)' }"
          >
            <div class="q-pa-md">
              <EmptyState
                v-if="messages.length === 0"
                @load-sample="handleLoadSample"
                @load-file="openFileDialog"
              />

              <div v-else>
                <MessageGroup
                  v-for="(group, index) in groupedMessages"
                  :key="index"
                  :group="group"
                  :current-pov="currentPov"
                  :get-sender-color="getSenderColor"
                />
              </div>
            </div>
          </q-scroll-area>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFileDialog } from '@vueuse/core'
import { uniq } from 'es-toolkit'
import type { Message } from '../types/message'
import { useFileHandler } from '../composables/useFileHandler'
import { useMessageGrouping } from '../composables/useMessageGrouping'
import { useSenderColors } from '../composables/useSenderColors'
import PovSelector from '../components/PovSelector.vue'
import EmptyState from '../components/EmptyState.vue'
import MessageGroup from '../components/MessageGroup.vue'

const messages = ref<Message[]>([])
const currentPov = ref<string>('')

const { loadSampleChat, handleFileUpload } = useFileHandler(messages)

const { open: openFileDialog, onChange } = useFileDialog({
  accept: '.txt,image/*,video/*',
  multiple: true,
})

const participants = computed(() => {
  return uniq(messages.value.map(msg => msg.sender))
    .filter(sender => sender !== 'System')
    .sort()
})

const chatTitle = computed(() => {
  if (messages.value.length === 0) return 'WhatsLog Viewer'

  const systemMessages = messages.value.filter(msg => msg.isSystem)

  for (let i = systemMessages.length - 1; i >= 0; i--) {
    const msg = systemMessages[i]
    if (!msg) continue

    const match = msg.text.match(/(?:created group|to)\s+["“”]([^"“”]+)["“”]/)
    if (match?.[1]) return match[1]
  }

  return participants.value.length > 0 ? 'Chat' : 'WhatsLog Viewer'
})

const { groupedMessages } = useMessageGrouping(messages)
const { getSenderColor } = useSenderColors(participants)

const handleLoadSample = async () => {
  const success = await loadSampleChat()
  if (success) {
    currentPov.value = 'You'
  }
}

onChange((fileList) => {
  void handleFileUpload(fileList)
})

onMounted(() => {
  void handleLoadSample()
})
</script>

<style scoped>
:deep(.q-chip) {
  height: auto;
}

:deep(.q-chip__content) {
  white-space: normal;
}
</style>
