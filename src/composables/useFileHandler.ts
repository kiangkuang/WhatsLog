import type { Ref } from 'vue'
import { watch } from 'vue'
import { useQuasar } from 'quasar'
import { useBase64 } from '@vueuse/core'
import { sortBy } from 'es-toolkit'
import type { Message } from '../types/message'
import { useChatParser } from './useChatParser'

export function useFileHandler(messages: Ref<Message[]>) {
  const $q = useQuasar()
  const { parseWhatsAppChat } = useChatParser()

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
  const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.3gp']

  const isImageFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase()
    return file.type.startsWith('image/') || imageExtensions.some(ext => fileName.endsWith(ext))
  }

  const isVideoFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase()
    return file.type.startsWith('video/') || videoExtensions.some(ext => fileName.endsWith(ext))
  }

  const readMediaFile = async (file: File): Promise<{ url: string, type: 'image' | 'video' }> => {
    const { base64 } = useBase64(file)
    const type = isImageFile(file) ? 'image' : 'video'
    return new Promise((resolve) => {
      watch(base64, (value) => {
        if (value) {
          resolve({ url: value, type })
        }
      }, { immediate: true })
    })
  }

  const loadSampleChat = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}sample-chat.txt`)
      if (!response.ok) throw new Error('Failed to fetch')

      const content = await response.text()
      const parsedMessages = parseWhatsAppChat(content)

      const imageResponse = await fetch(`${import.meta.env.BASE_URL}sample-image.svg`)
      if (imageResponse.ok) {
        const blob = await imageResponse.blob()
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          const mediaMessage = parsedMessages.find(msg => msg.text === '<Media omitted>')
          if (mediaMessage) {
            mediaMessage.mediaUrl = imageUrl
            mediaMessage.mediaType = 'image'
          }
          messages.value = parsedMessages
        }
        reader.readAsDataURL(blob)
      }
      else {
        messages.value = parsedMessages
      }

      $q.notify({
        type: 'positive',
        message: 'Sample chat loaded successfully',
        position: 'top',
      })

      return true
    }
    catch {
      $q.notify({
        type: 'negative',
        message: 'Failed to load sample chat',
        position: 'top',
      })
      return false
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
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

    const mediaFiles = sortBy(
      fileArray.filter(f => !f.name.endsWith('.txt') && (isImageFile(f) || isVideoFile(f))),
      [(f: File) => f.name],
    )

    const mediaUrls = await Promise.all(mediaFiles.map(readMediaFile))

    const parseMediaFilename = (filename: string) => {
      const match = filename.match(/(?:IMG|VID)-(\d{8})-WA(\d{4})/)
      if (match && match[1] && match[2]) {
        return {
          date: match[1],
          sequence: Number.parseInt(match[2], 10),
        }
      }
      return null
    }

    const parseMessageDate = (timestamp: string): string | null => {
      const match = timestamp.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/)
      if (match && match[1] && match[2] && match[3]) {
        const month = match[1].padStart(2, '0')
        const day = match[2].padStart(2, '0')
        let year = match[3]
        if (year.length === 2) {
          year = `20${year}`
        }
        return `${year}${month}${day}`
      }
      return null
    }

    const mediaByDate = new Map<string, Array<{ url: string, type: 'image' | 'video', filename: string, sequence: number }>>()
    mediaFiles.forEach((file, index) => {
      const parsed = parseMediaFilename(file.name)
      const mediaUrl = mediaUrls[index]
      if (parsed && mediaUrl) {
        if (!mediaByDate.has(parsed.date)) {
          mediaByDate.set(parsed.date, [])
        }
        const items = mediaByDate.get(parsed.date)
        if (items) {
          items.push({
            ...mediaUrl,
            filename: file.name,
            sequence: parsed.sequence,
          })
        }
      }
    })

    mediaByDate.forEach((items) => {
      items.sort((a, b) => a.sequence - b.sequence)
    })

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const parsedMessages = parseWhatsAppChat(content)

      const mediaIndexByDate = new Map<string, number>()

      for (const msg of parsedMessages) {
        if (msg.text === '<Media omitted>' && msg.timestamp) {
          const msgDate = parseMessageDate(msg.timestamp)

          if (msgDate) {
            const currentIndex = mediaIndexByDate.get(msgDate) || 0
            const mediaItems = mediaByDate.get(msgDate)

            if (mediaItems && currentIndex < mediaItems.length) {
              const mediaItem = mediaItems[currentIndex]
              if (mediaItem) {
                msg.mediaUrl = mediaItem.url
                msg.mediaType = mediaItem.type
                msg.mediaFilename = mediaItem.filename
                mediaIndexByDate.set(msgDate, currentIndex + 1)
              }
            }
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
  }

  return {
    loadSampleChat,
    handleFileUpload,
  }
}
