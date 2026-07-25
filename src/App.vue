<script setup lang="ts">
import { getRoadSize, getMtbSize, getCitySize } from './utils/getSizes'
import { ref, computed, watch, onMounted } from 'vue'
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

onMounted(() => {
  setRoadSize()
})
</script>

<template>
  <header class="uppercase px-4 h-12 font-semibold flex items-center border-b border-b-neutral-300">
    Bike finder
  </header>
  <main>
    <section class="w-full grid grid-cols-2 items-start">
      <div class="bg-neutral-100 min-h-dvh">
        <img
          src="https://cdn.mos.cms.futurecdn.net/AziEScuczQYWXQPNMDteB5.jpg"
          alt=""
          class="w-full h-120 object-cover"
        />
        <p>Recommened size={{ currentSize.alphaSize }}</p>
        <p v-if="currentType === 'Road'">Size in CM={{ currentSize.cmSize }}</p>
      </div>
      <div class="px-8 py-8 w-full max-w-120 justify-self-center grid grid-cols-1 gap-4">
        <h1 class="text-4xl font-semibold">Find your bike size</h1>
        <div>
          <span class="font-medium">Select bike type</span>
          <div class="grid grid-cols-3 gap-1">
            <button
              v-for="bike in bikeTypes"
              @click="selectType(bike)"
              class="px-4 py-2 rounded-sm hover:cursor-pointer transition-colors duration-300 font-medium"
              :class="
                currentType === bike ? 'bg-amber-200 ' : 'bg-neutral-200 hover:bg-neutral-300'
              "
            >
              {{ bike }}
            </button>
          </div>
        </div>

        <div>
          <span class="font-medium">Measurements</span>
          <div class="grid grid-cols-2 gap-1">
            <label
              >Feet
              <input
                @input="setSizeByHeight"
                v-model.number="currentFeet"
                name="feet"
                type="number"
                min="4"
                max="6"
                :disabled="currentType === 'Road'"
              />
            </label>
            <label
              >Inches
              <input
                @input="setSizeByHeight"
                v-model.number="currentInches"
                name="inches"
                type="number"
                min="0"
                max="11"
                :disabled="currentType === 'Road'"
              />
            </label>
          </div>
        </div>

        <label
          >Inseam
          <input
            @input="setRoadSize"
            v-model.number="currentInseam"
            name="inseam"
            type="number"
            min="26"
            max="39"
            :disabled="currentType !== 'Road'"
          />
        </label>
      </div>
    </section>
  </main>
</template>
