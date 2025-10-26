import { computed } from 'vue'
import type { Ref } from 'vue'

export function useSenderColors(participants: Ref<string[]>) {
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

  return {
    getSenderColor,
  }
}
