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

function setSizeByInseam() {
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
  if (currentType.value === 'Road') {
    setSizeByInseam()
  } else {
    setSizeByHeight()
  }
})

onMounted(() => {
  setSizeByInseam()
})
</script>

<template>
  <header
    class="uppercase px-4 h-12 font-semibold flex items-center border-b border-b-neutral-300 fixed z-100 w-full bg-white"
  >
    Bike finder
  </header>
  <main class="">
    <section class="w-full grid grid-cols-2 items-start">
      <div class="bg-neutral-100 h-[calc(100dvh-3rem)] mt-12 hidden md:block sticky top-12">
        <img
          src="https://cdn.mos.cms.futurecdn.net/AziEScuczQYWXQPNMDteB5.jpg"
          alt=""
          class="size-full object-cover"
        />
      </div>
      <div class="px-8 py-12 w-full max-w-250 justify-self-center grid grid-cols-1 gap-8 mt-12">
        <h1 class="text-5xl font-semibold mb-4">Find your bike size</h1>
        <div>
          <span class="uppercase text-sm font-mono text-neutral-500">Recommended Size</span>
          <div class="flex items-end gap-2 font-semibold text-neutral-800">
            <span class="text-7xl">{{ currentSize.alphaSize }}</span>
            <span class="text-neutral-500 pb-1" v-if="currentType === 'Road'">
              <span class="mr-0.5">/</span>
              {{ currentSize.cmSize }}cm
            </span>
          </div>
        </div>
        <div class="p-6 bg-neutral-50 rounded-md grid grid-cols-1 gap-6 border border-neutral-200">
          <div>
            <span class="font-medium mb-2 block">Select bike type</span>
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
            <span class="font-medium mb-2 block">Measurements</span>
            <div class="text-sm italic mb-2 text-neutral-600 leading-none">
              <p v-if="currentType === 'Road'">Your size will be calculated by your inseam.</p>
              <p v-else>Your size will be calculated by your height.</p>
            </div>
            <fieldset class="grid grid-cols-2 gap-1 mb-2">
              <legend class="mb-1 text-neutral-700 text-sm font-medium">Height</legend>
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
            </fieldset>
            <fieldset>
              <legend class="mb-1 text-neutral-700 text-sm font-medium">Inseam</legend>
              <label
                >Inches
                <input
                  @input="setSizeByInseam"
                  v-model.number="currentInseam"
                  name="inseam"
                  type="number"
                  step="0.1"
                  min="26"
                  max="39"
                  :disabled="currentType !== 'Road'"
                />
              </label>
            </fieldset>
          </div>
          <!-- Conditional notes for the bike type -->
        </div>
        <div class="p-6 bg-neutral-50 rounded-md border border-neutral-200">
          <h2 class="font-medium mb-4">Tips & Recommendations</h2>
          <ul class="flex flex-col gap-2 text-neutral-700">
            <template v-if="currentType === 'Road'">
              <li
                >See our <a class="text-link" href="">measuremment guide</a> to ensure you are
                capturing your inseam correctly.</li
              >
            </template>
            <template v-else-if="currentType === 'MTB'">
              <li
                >When shopping mountain bikes, we recommend reviewing the Reach and Effective Top
                Tube measurements in the geometry chart found on each detail page.</li
              >
              <li
                >If you have a relatively long torso or arms for your height, you may find that a
                longer reach gives you a roomier, more comfortable cockpit. If you have a relatively
                short torso or arms for your height, you may find that a shorter reach makes it
                easier for you to hold the handlebars comfortably.</li
              >
            </template>
            <template v-else-if="currentType === 'City'">
              <li>Sizing may vary depending on your city/hybrid bike choice.</li>
            </template>
            <template v-if="currentType !== 'MTB'"
              ><li
                >Hovering between sizes? Go smaller for a sportier feel, and larger for a comfier,
                touring-style ride.
              </li></template
            >
            <li
              >If you have questions about the measuring process or whether sizing up or down would
              be good for your riding style, let's talk! Call Customer Service or connect with your
              local retailer.</li
            >
          </ul>
        </div>
        <!-- Include carousel for shopping bikes of the current type, based on separate data file -->
      </div>
    </section>
  </main>
</template>
