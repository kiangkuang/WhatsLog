import { compact } from 'es-toolkit'
import type { Message } from '../types/message'

export function useChatParser() {
  const parseWhatsAppChat = (content: string): Message[] => {
    const lines = content.split('\n')
    const messageRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d{1,2}:\d{2}\s+(?:AM|PM))\s+-\s+([^:]+):\s+(.+)$/
    const systemRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d{1,2}:\d{2}\s+(?:AM|PM))\s+-\s+(.+)$/

    const parsedMessages = lines.map((line): Message | null => {
      const messageMatch = line.match(messageRegex)
      if (messageMatch && messageMatch[1] && messageMatch[2] && messageMatch[3]) {
        return {
          sender: messageMatch[2].trim(),
          text: messageMatch[3].trim(),
          timestamp: messageMatch[1].trim(),
        }
      }

      const systemMatch = line.match(systemRegex)
      if (systemMatch && systemMatch[1] && systemMatch[2]) {
        return {
          sender: 'System',
          text: systemMatch[2].trim(),
          timestamp: systemMatch[1].trim(),
          isSystem: true,
        }
      }

      return null
    })

    return compact(parsedMessages)
  }

  return {
    parseWhatsAppChat,
  }
}
