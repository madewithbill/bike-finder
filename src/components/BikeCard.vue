<script setup lang="ts">
const props = defineProps(['bike'])
import { createImgSrc } from '@/utils/imageSrc.ts'

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price / 100)
}
</script>

<template>
  <figure class="relative">
    <a
      @click.prevent
      href="#"
      :aria-label="bike.name"
      class="absolute inset-0 z-1 outline-hidden focus-visible:rounded-sm focus-visible:border-2 focus-visible:border-neutral-950"
    ></a>
    <div class="relative aspect-4/3 rounded-sm bg-neutral-100/80 p-6 pt-0">
      <img
        v-if="bike.main_image"
        aria-hidden="true"
        :src="createImgSrc(bike.main_image)"
        :alt="bike.name"
      />
      <span
        v-if="bike.on_sale"
        class="absolute top-3 right-3 rounded-sm bg-red-700 px-2 py-1 text-xs font-semibold text-white uppercase"
        >Sale</span
      >
    </div>
    <div class="py-4 max-md:text-sm">
      <span
        aria-hidden="true"
        class="block leading-tight font-semibold tracking-tight text-neutral-800"
        >{{ bike.name }}</span
      >
      <span v-if="bike.sale_price" class="mr-2 text-red-700">{{
        formatPrice(bike.sale_price)
      }}</span>
      <span class="text-neutral-600/80" :class="bike.on_sale ? 'line-through' : null">{{
        formatPrice(bike.price)
      }}</span>
    </div>
  </figure>
</template>
