import type { Ref } from 'vue'
import { useQuasar } from 'quasar'
import type { Message } from '../types/message'
import { useChatParser } from './useChatParser'

export function useFileHandler(messages: Ref<Message[]>) {
  const $q = useQuasar()
  const { parseWhatsAppChat } = useChatParser()

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

  const readMediaFile = (file: File): Promise<{ url: string, type: 'image' | 'video' }> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        const type = isImageFile(file) ? 'image' : 'video'
        resolve({ url, type })
      }
      reader.readAsDataURL(file)
    })
  }

  const loadSampleChat = async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}sample-chat.txt`)
      const content = await response.text()
      messages.value = parseWhatsAppChat(content)

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

    const mediaFiles = fileArray
      .filter(f => !f.name.endsWith('.txt') && (isImageFile(f) || isVideoFile(f)))
      .sort((a, b) => a.name.localeCompare(b.name))

    const mediaUrls = await Promise.all(mediaFiles.map(readMediaFile))

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
  }

  return {
    loadSampleChat,
    handleFileUpload,
  }
}
