import { computed } from 'vue'
import type { Ref } from 'vue'
import { last } from 'es-toolkit'
import type { Message, GroupedMessage } from '../types/message'

export function useMessageGrouping(messages: Ref<Message[]>) {
  const getDateFromTimestamp = (timestamp: string): string => {
    return timestamp.split(',')[0] || ''
  }

  const hasMedia = (msg: Message): boolean => {
    return Boolean(msg.mediaUrl)
  }

  const groupedMessages = computed(() => {
    return messages.value.reduce<GroupedMessage[]>((groups, currentMsg, i) => {
      const previousMsg = messages.value[i - 1]

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
        const lastGroup = last(groups)
        if (lastGroup) {
          lastGroup.texts.push(currentMsg.text)
          lastGroup.timestamp = currentMsg.timestamp
          lastGroup.messages.push(currentMsg)
        }
      }

      return groups
    }, [])
  })

  return {
    groupedMessages,
    getDateFromTimestamp,
  }
}
