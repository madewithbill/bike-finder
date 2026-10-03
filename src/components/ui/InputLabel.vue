<script setup lang="ts">
defineProps<{
  labelFor: string
}>()
</script>

<template>
  <label :for="labelFor" class="text-sm text-neutral-500"><slot></slot></label>
</template>
