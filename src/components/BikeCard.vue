<script setup lang="ts">
const props = defineProps(['bike'])

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(price / 100)
}
</script>

<template>
  <div class="relative">
    <a href="" :aria-label="bike.name" class="absolute inset-0 z-1"></a>
    <div class="bg-neutral-100/80 p-6 pt-0 rounded-sm relative aspect-4/3">
      <img v-if="bike.main_image" :src="bike.main_image" alt="" class="" />
      <span
        v-if="bike.on_sale"
        class="absolute top-3 right-3 uppercase px-2 py-1 bg-red-700 text-white rounded-sm text-xs font-semibold"
        >Sale</span
      >
    </div>
    <div class="py-4 max-md:text-sm">
      <span class="block font-semibold leading-tight text-neutral-800 tracking-tight">{{
        bike.name
      }}</span>
      <span v-if="bike.sale_price" class="mr-2 text-red-700">{{
        formatPrice(bike.sale_price)
      }}</span>
      <span class="text-neutral-600/80" :class="bike.on_sale ? 'line-through' : null">{{
        formatPrice(bike.price)
      }}</span>
    </div>
  </div>
</template>
