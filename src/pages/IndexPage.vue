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
                <q-btn
                  v-if="participants.length > 0"
                  flat
                  round
                  dense
                  icon="person"
                  color="white"
                  class="q-mr-sm"
                >
                  <q-menu>
                    <q-list style="min-width: 200px">
                      <q-item-label header>Switch POV</q-item-label>
                      <q-item
                        clickable
                        v-close-popup
                        @click="currentPov = ''"
                        :active="currentPov === ''"
                      >
                        <q-item-section avatar>
                          <q-icon :name="currentPov === '' ? 'radio_button_checked' : 'radio_button_unchecked'" />
                        </q-item-section>
                        <q-item-section>None</q-item-section>
                      </q-item>
                      <q-item
                        v-for="participant in participants"
                        :key="participant"
                        clickable
                        v-close-popup
                        @click="currentPov = participant"
                        :active="currentPov === participant"
                      >
                        <q-item-section avatar>
                          <q-icon :name="currentPov === participant ? 'radio_button_checked' : 'radio_button_unchecked'" />
                        </q-item-section>
                        <q-item-section>
                          <span :style="{ color: getSenderColor(participant), fontWeight: 'bold' }">{{ participant }}</span>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
                <q-btn
                  flat
                  round
                  dense
                  icon="upload_file"
                  color="white"
                  @click="triggerFileInput"
                />
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-scroll-area
            class="bg-grey-3"
            :style="{ height: 'calc(100vh - 100px)' }"
            ref="chatContainer"
          >
            <div class="q-pa-md">
              <div v-if="messages.length === 0" class="text-center text-grey-6 q-pa-xl">
                <q-icon name="chat" size="64px" class="q-mb-md" />
                <div class="text-h6">No messages yet</div>
                <div class="text-body2 q-mt-sm">Load a chat to get started</div>
                <div class="q-mt-md">
                  <q-btn
                    color="teal"
                    label="Load Sample Chat"
                    @click="loadSampleChat"
                    class="q-mr-sm"
                  />
                  <q-btn
                    color="teal"
                    outline
                    label="Load Your Chat"
                    @click="triggerFileInput"
                  />
                </div>
              </div>

              <div v-else>
                <div
                  v-for="(group, index) in groupedMessages"
                  :key="index"
                  class="message-group"
                >
                  <template v-if="group.showDateSeparator || group.messages[0]?.isSystem">
                    <div
                      v-for="(chip, chipIndex) in [
                        ...(group.showDateSeparator ? [group.date] : []),
                        ...(group.messages[0]?.isSystem ? group.messages.map(m => m.text) : [])
                      ]"
                      :key="`${index}-chip-${chipIndex}`"
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
                      :key="`${index}-${msgIndex}`"
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
              </div>
            </div>
          </q-scroll-area>
        </q-card>

        <input
          ref="fileInput"
          type="file"
          accept=".txt,image/*,video/*"
          multiple
          class="hidden"
          @change="handleFileUpload"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar, QScrollArea } from 'quasar'

interface Message {
  sender: string
  text: string
  timestamp: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  isSystem?: boolean
}

interface GroupedMessage {
  sender: string
  texts: string[]
  timestamp: string
  date: string
  showDateSeparator: boolean
  messages: Message[]
}

const $q = useQuasar()
const messages = ref<Message[]>([])
const currentPov = ref<string>('')
const fileInput = ref<HTMLInputElement | null>(null)
const chatContainer = ref<QScrollArea | null>(null)

const participants = computed(() => {
  const uniqueSenders = new Set(messages.value.map(msg => msg.sender))
  return Array.from(uniqueSenders).sort()
})

const chatTitle = computed(() => {
  if (messages.value.length === 0) return 'WhatsLog Viewer'
  return participants.value.length > 0 ? 'Chat' : 'WhatsLog Viewer'
})

const groupedMessages = computed(() => {
  const groups: GroupedMessage[] = []

  const hasMedia = (msg: Message): boolean => {
    return Boolean(msg.mediaUrl)
  }

  for (let i = 0; i < messages.value.length; i++) {
    const currentMsg = messages.value[i]
    const previousMsg = messages.value[i - 1]

    if (!currentMsg) continue

    const currentDate = getDateFromTimestamp(currentMsg.timestamp)
    const showDateSeparator = i === 0 || (previousMsg && currentDate !== getDateFromTimestamp(previousMsg.timestamp))

    const currentHasMedia = hasMedia(currentMsg)
    const previousHasMedia = previousMsg ? hasMedia(previousMsg) : false
    const mediaTypeChanged = previousMsg && currentHasMedia !== previousHasMedia

    const isNewGroup = i === 0
      || showDateSeparator
      || (previousMsg && currentMsg.sender !== previousMsg.sender)
      || mediaTypeChanged

    if (isNewGroup) {
      groups.push({
        sender: currentMsg.sender,
        texts: [currentMsg.text],
        timestamp: currentMsg.timestamp,
        date: currentDate,
        showDateSeparator: showDateSeparator || false,
        messages: [currentMsg],
      })
    }
    else {
      const lastGroup = groups[groups.length - 1]
      if (lastGroup) {
        lastGroup.texts.push(currentMsg.text)
        lastGroup.timestamp = currentMsg.timestamp
        lastGroup.messages.push(currentMsg)
      }
    }
  }

  return groups
})

const parseWhatsAppChat = (content: string): Message[] => {
  const lines = content.split('\n')
  const parsedMessages: Message[] = []

  const messageRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d{1,2}:\d{2}\s+(?:AM|PM))\s+-\s+([^:]+):\s+(.+)$/
  const systemRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d{1,2}:\d{2}\s+(?:AM|PM))\s+-\s+(.+)$/

  for (const line of lines) {
    const messageMatch = line.match(messageRegex)
    if (messageMatch && messageMatch[1] && messageMatch[2] && messageMatch[3]) {
      const timestamp = messageMatch[1]
      const sender = messageMatch[2]
      const text = messageMatch[3]
      parsedMessages.push({
        sender: sender.trim(),
        text: text.trim(),
        timestamp: timestamp.trim(),
      })
    }
    else {
      const systemMatch = line.match(systemRegex)
      if (systemMatch && systemMatch[1] && systemMatch[2]) {
        const timestamp = systemMatch[1]
        const text = systemMatch[2]
        parsedMessages.push({
          sender: 'System',
          text: text.trim(),
          timestamp: timestamp.trim(),
          isSystem: true,
        })
      }
    }
  }

  return parsedMessages
}

const loadSampleChat = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}sample-chat.txt`)
    const content = await response.text()
    messages.value = parseWhatsAppChat(content)
    currentPov.value = 'You'

    $q.notify({
      type: 'positive',
      message: 'Sample chat loaded successfully',
      position: 'top',
    })
  }
  catch {
    $q.notify({
      type: 'negative',
      message: 'Failed to load sample chat',
      position: 'top',
    })
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  const fileArray = Array.from(files)
  const txtFile = fileArray.find(f => f.name.endsWith('.txt'))

  if (!txtFile) {
    $q.notify({
      type: 'negative',
      message: 'No .txt file found',
      position: 'top',
    })
    return
  }

  const isImageFile = (file: File): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
    const fileName = file.name.toLowerCase()
    return file.type.startsWith('image/') || imageExtensions.some(ext => fileName.endsWith(ext))
  }

  const isVideoFile = (file: File): boolean => {
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp']
    const fileName = file.name.toLowerCase()
    return file.type.startsWith('video/') || videoExtensions.some(ext => fileName.endsWith(ext))
  }

  const mediaFiles = fileArray
    .filter(f => !f.name.endsWith('.txt') && (isImageFile(f) || isVideoFile(f)))
    .sort((a, b) => a.name.localeCompare(b.name))

  const mediaUrls = await Promise.all(
    mediaFiles.map((file) => {
      return new Promise<{ url: string, type: 'image' | 'video' }>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const url = e.target?.result as string
          const type = isImageFile(file) ? 'image' : 'video'
          resolve({ url, type })
        }
        reader.readAsDataURL(file)
      })
    }),
  )

  const mediaMap = new Map<string, { url: string, type: 'image' | 'video' }>()
  mediaFiles.forEach((file, index) => {
    if (mediaUrls[index]) {
      mediaMap.set(file.name.toLowerCase(), mediaUrls[index])
    }
  })

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    const parsedMessages = parseWhatsAppChat(content)

    let mediaIndex = 0
    for (const msg of parsedMessages) {
      const fileAttachedMatch = msg.text.match(/^(.+?)\s*\(file attached\)$/i)

      if (fileAttachedMatch && fileAttachedMatch[1]) {
        const fileName = fileAttachedMatch[1].trim().toLowerCase()
        const mediaItem = mediaMap.get(fileName)
        if (mediaItem) {
          msg.mediaUrl = mediaItem.url
          msg.mediaType = mediaItem.type
        }
      }
      else if (msg.text === '<Media omitted>') {
        const mediaItem = mediaUrls[mediaIndex]
        if (mediaItem) {
          msg.mediaUrl = mediaItem.url
          msg.mediaType = mediaItem.type
          mediaIndex++
        }
      }
    }

    messages.value = parsedMessages

    $q.notify({
      type: 'positive',
      message: `Chat loaded: ${txtFile.name} with ${mediaUrls.length} media files`,
      position: 'top',
    })
  }
  reader.readAsText(txtFile)

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const getDateFromTimestamp = (timestamp: string): string => {
  return timestamp.split(',')[0] || ''
}

const senderColorMap = computed(() => {
  const map = new Map<string, string>()
  const participantList = participants.value
  const count = participantList.length

  if (count === 0) return map

  const hueStep = 360 / count

  participantList.forEach((participant, index) => {
    const hue = Math.round(index * hueStep)
    map.set(participant, `hsl(${hue}, 70%, 45%)`)
  })

  return map
})

const getSenderColor = (sender: string): string => {
  return senderColorMap.value.get(sender) || 'hsl(0, 70%, 45%)'
}

const linkifyText = (text: string): string => {
  const escapeHtml = (str: string): string => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  const escapedText = escapeHtml(text)

  const urlRegex = /(https?:\/\/[^\s]+)/g

  return escapedText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1976d2; text-decoration: underline;">${url}</a>`
  })
}

onMounted(() => {
  void loadSampleChat()
})
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

:deep(.q-chip) {
  height: auto;
}

:deep(.q-chip__content) {
  white-space: normal;
}
</style>
