<template>
  <q-btn
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
          @click="emit('update:modelValue', '')"
          :active="modelValue === ''"
        >
          <q-item-section avatar>
            <q-icon :name="modelValue === '' ? 'radio_button_checked' : 'radio_button_unchecked'" />
          </q-item-section>
          <q-item-section>None</q-item-section>
        </q-item>
        <q-item
          v-for="participant in participants"
          :key="participant"
          clickable
          v-close-popup
          @click="emit('update:modelValue', participant)"
          :active="modelValue === participant"
        >
          <q-item-section avatar>
            <q-icon :name="modelValue === participant ? 'radio_button_checked' : 'radio_button_unchecked'" />
          </q-item-section>
          <q-item-section>
            <span :style="{ color: getSenderColor(participant), fontWeight: 'bold' }">{{ participant }}</span>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  participants: string[]
  getSenderColor: (sender: string) => string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
