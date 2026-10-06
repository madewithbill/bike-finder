<script setup lang="ts">
defineProps<{
  id: string
}>()
</script>
<template>
  <input
    :id="id"
    type="checkbox"
    class="relative size-3.25 appearance-none rounded-xs border border-neutral-400 text-sm leading-0 outline-hidden checked:border checked:border-neutral-950 checked:bg-neutral-950 checked:before:absolute checked:before:inset-0 checked:before:bg-[url(/src/assets/check-fat-fill.svg)] checked:before:bg-size-[10px] checked:before:bg-center checked:before:bg-no-repeat hover:cursor-pointer focus-visible:border-2 focus-visible:border-neutral-950 disabled:bg-neutral-300 disabled:opacity-20"
  />
</template>
