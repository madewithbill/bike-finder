<script setup lang="ts">
defineProps<{
  id: string
  name?: string
  type?: string
}>()

const model = defineModel()
</script>

<template>
  <select
    v-model="model"
    class="absolute inset-0 appearance-none rounded-sm border border-neutral-400 px-3 pt-4.5 text-base text-neutral-800 outline-hidden hover:cursor-pointer focus-visible:border-2 focus-visible:border-neutral-950 disabled:bg-neutral-300 disabled:opacity-20"
  >
    <slot></slot>
  </select>
  <span class="absolute right-2 leading-0 top-1/2 -translate-1/2 pointer-events-none">&#8964</span>
</template>
