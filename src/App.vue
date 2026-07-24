<script setup lang="ts">
import { getRoadSize, getMtbSize, getCitySize } from './utils/getSizes'
import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'

const bikeTypes = ['Road', 'MTB', 'City']
const currentType = ref('Road')
const currentFeet = ref(5)
const currentInches = ref(10)
const currentHeight = computed(() => currentFeet.value * 12 + currentInches.value)
const currentInseam = ref(26)
const currentSize: Ref<{ alphaSize: string; cmSize?: string }> = ref({ alphaSize: '', cmSize: '' })

function selectType(bike: string) {
  currentType.value = bike
}

function setRoadSize() {
  currentSize.value = getRoadSize(currentInseam.value)
}

function setSizeByHeight() {
  if (currentType.value === 'MTB') {
    currentSize.value = getMtbSize(currentHeight.value)
  }
  if (currentType.value === 'City') {
    currentSize.value = getCitySize(currentHeight.value)
  }
}
watch(currentType, () => {
  console.log(currentType.value === 'Road')
})
</script>

<template>
  <main>
    <section class="min-h-dvh w-full flex flex-col justify-center items-center">
      <div>
        <h1 class="text-5xl mb-2">bike finder</h1>
        <p>Recommened size={{ currentSize.alphaSize }}</p>
        <p v-if="currentType === 'Road'">Size in CM={{ currentSize.cmSize }}</p>
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
          @input="setSizeByHeight"
          v-model.number="currentFeet"
          id="feet"
          type="number"
          min="4"
          max="6"
          :disabled="currentType === 'Road'"
          class="h-8 border"
        />
        <label for="inches">inches</label>
        <input
          @input="setSizeByHeight"
          v-model.number="currentInches"
          id="inches"
          type="number"
          min="0"
          max="11"
          :disabled="currentType === 'Road'"
          class="h-8 border"
        />
        <p>current height is: {{ currentHeight }}</p>
        <label for="inseam">inches</label>
        <input
          @input="setRoadSize"
          v-model.number="currentInseam"
          id="inseam"
          type="number"
          min="26"
          max="39"
          :disabled="currentType !== 'Road'"
          class="h-8 border"
        />
        <p>current inseam is: {{ currentInseam }}</p>
      </div>
    </section>
  </main>
</template>
