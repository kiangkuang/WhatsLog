<template>
  <div class="text-center text-grey-6 q-pa-xl">
    <q-icon name="chat" size="64px" class="q-mb-md" />
    <div class="text-h6">No messages yet</div>
    <div class="text-body2 q-mt-sm">Load a chat to get started</div>
    <div class="q-mt-md">
      <q-btn
        color="teal"
        label="Load Sample Chat"
        @click="emit('load-sample')"
        class="q-mr-sm"
      />
      <q-btn
        color="teal"
        outline
        label="Load Your Chat"
        @click="emit('load-file')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  'load-sample': []
  'load-file': []
}>()
</script>
