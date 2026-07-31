<script setup lang="ts">
const props = defineProps(['type'])

import roadImg from '../assets/images/road-bike-hero.avif'
import mtbImg from '../assets/images/mtb-bike-hero.avif'
import cityImg from '../assets/images/city-hybrid-bike-hero.avif'
</script>

<template>
  <img v-if="props.type === 'Road'" :src="roadImg" alt="" class="size-full object-cover" />
  <img v-if="props.type === 'MTB'" :src="mtbImg" alt="" class="size-full object-cover" />
  <img v-if="props.type === 'City'" :src="cityImg" alt="" class="size-full object-cover" />
</template>
