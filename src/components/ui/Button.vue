<script setup lang="ts">
defineProps<{
  variant?: 'secondary' | 'danger'
  size?: 'sm' | 'lg'
}>()
</script>

<template>
  <button
    class="rounded-full leading-0"
    :class="[
      !variant && 'bg-neutral-950 text-white',
      variant === 'secondary' && 'border border-neutral-950 bg-white text-neutral-950',
      variant === 'danger' && 'bg-red-700 text-white',
      !size && 'h-8 px-4 text-sm',
      size === 'sm' && 'h-7 px-3 text-sm',
      size === 'lg' && 'h-10 px-4 text-base',
    ]"
  >
    <slot></slot>
  </button>
</template>
