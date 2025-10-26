export interface Message {
  sender: string
  text: string
  timestamp: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  isSystem?: boolean
}

export interface GroupedMessage {
  sender: string
  timestamp: string
  date: string
  showDateSeparator: boolean
  messages: Message[]
}
