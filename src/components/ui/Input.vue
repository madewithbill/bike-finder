<script setup lang="ts">
defineProps<{
  id: string
  name?: string
  type?: string
}>()

const model = defineModel({})
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :name="name"
    :id="id"
    autocomplete="off"
    class="absolute inset-0 rounded-sm border border-neutral-400 px-3 pt-4.5 text-base text-neutral-800 outline-hidden focus-visible:border-2 focus-visible:border-neutral-950 disabled:bg-neutral-300 disabled:opacity-20"
  />
</template>
