<script setup lang="ts">
import { ref } from 'vue'

const bikeTypes = ['Road', 'Gravel', 'City']
const currentType = ref('Road')

function selectType(bike: string) {
  currentType.value = bike
}
</script>

<template>
  <main>
    <section class="min-h-dvh w-full flex flex-col justify-center items-center">
      <h1 class="text-5xl">bike finder</h1>
      <div class="flex gap-4">
        <button
          v-for="bike in bikeTypes"
          @click="selectType(bike)"
          class="px-4 py-2 rounded-sm hover:cursor-pointer transition-colors duration-300 font-medium"
          :class="currentType === bike ? 'bg-amber-200 ' : 'bg-neutral-200 hover:bg-neutral-300'"
        >
          {{ bike }}
        </button>
      </div>
      <p>Selected bike type: {{ currentType }}</p>
    </section>
  </main>
</template>
