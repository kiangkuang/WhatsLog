import { computed } from 'vue'
import type { Ref } from 'vue'

export function useSenderColors(participants: Ref<string[]>) {
  const senderColorMap = computed(() => {
    const participantList = participants.value
    const count = participantList.length

    if (count === 0) return new Map<string, string>()

    const hueStep = 360 / count

    const colorPairs = participantList.map((participant, index) => {
      const hue = Math.round(index * hueStep)
      return [participant, `hsl(${hue}, 70%, 45%)`] as const
    })

    return new Map(colorPairs)
  })

  const getSenderColor = (sender: string): string => {
    return senderColorMap.value.get(sender) || 'hsl(0, 70%, 45%)'
  }

  return {
    getSenderColor,
  }
}
