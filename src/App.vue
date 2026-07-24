<script setup lang="ts">
import { ref } from 'vue'

const bikeTypes = ['Road', 'Gravel', 'City']
const currentType = ref('Road')
const currentHeight = ref(0)
const currentFeet = ref(0)
const currentInches = ref(0)
const currentInseam = ref(0)

function selectType(bike: string) {
  currentType.value = bike
}

function getHeight() {
  currentHeight.value = currentFeet.value * 12 + currentInches.value
}
</script>

<template>
  <main>
    <section class="min-h-dvh w-full flex flex-col justify-center items-center">
      <div>
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
      </div>
      <div>
        <label for="feet">feet</label>
        <input
          @input="getHeight"
          v-model.number="currentFeet"
          id="feet"
          type="number"
          min="4"
          max="6"
          class="h-8 border"
        />
        <label for="inches">inches</label>
        <input
          @input="getHeight"
          v-model.number="currentInches"
          id="inches"
          type="number"
          min="0"
          max="11"
          class="h-8 border"
        />
        <p>current height is: {{ currentHeight }}</p>
        <label for="inseam">inches</label>
        <input
          v-model.number="currentInseam"
          id="inseam"
          type="number"
          min="26"
          max="39"
          class="h-8 border"
        />
        <p>current inseam is: {{ currentInseam }}</p>
      </div>
    </section>
  </main>
</template>
