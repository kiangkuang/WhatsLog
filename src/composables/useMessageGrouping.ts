import { computed } from 'vue'
import type { Ref } from 'vue'
import type { Message, GroupedMessage } from '../types/message'

export function useMessageGrouping(messages: Ref<Message[]>) {
  const getDateFromTimestamp = (timestamp: string): string => {
    return timestamp.split(',')[0] || ''
  }

  const hasMedia = (msg: Message): boolean => {
    return Boolean(msg.mediaUrl)
  }

  const groupedMessages = computed(() => {
    const groups: GroupedMessage[] = []

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

  return {
    groupedMessages,
    getDateFromTimestamp,
  }
}
