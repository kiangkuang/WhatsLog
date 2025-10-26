import type { Message } from '../types/message'

export function useChatParser() {
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

  return {
    parseWhatsAppChat,
  }
}
