<script setup lang="ts">
import { getRoadSize, getMtbSize, getCitySize } from './utils/getSizes'
import { ref, computed, watch, onMounted } from 'vue'
import type { Ref } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import { supabase } from './utils/supabaseClient.ts'

import Divider from './components/Divider.vue'
import NavLogo from './components/NavLogo.vue'
import HeroImage from './components/HeroImage.vue'
import type { Tables } from './utils/supabase.ts'
import BikeCard from './components/BikeCard.vue'

const bikeTypes = ['Road', 'MTB', 'City']
const currentType = ref('Road')
const currentFeet = ref(5)
const currentInches = ref(10)
const currentHeight = computed(() => currentFeet.value * 12 + currentInches.value)
const currentInseam = ref(28.5)

const currentSize = computed(() => {
  if (currentType.value === 'Road') {
    return getRoadSize(currentInseam.value)
  } else if (currentType.value === 'MTB') {
    return getMtbSize(currentHeight.value)
  } else {
    return getCitySize(currentHeight.value)
  }
})

function selectType(bike: string) {
  currentType.value = bike
}

watch(currentType, () => {
  getBikes()
})

const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })

function scrollNext() {
  emblaApi.value?.scrollNext()
}
function scrollPrev() {
  emblaApi.value?.scrollPrev()
}

const bikes: Ref<Tables<'bikes'>[] | null> = ref([])
const currentBikeList = computed(() => {
  return !bikes.value ? [] : bikes.value.filter((bike) => bike.bike_type === currentType.value)
})

async function getBikes() {
  const { data } = await supabase
    .from('bikes')
    .select()
    .eq('bike_type', currentType.value)
    .eq('in_stock', true)
  bikes.value = data
}

onMounted(() => {
  getBikes()
})
</script>

<template>
  <header
    class="uppercase px-4 h-12 font-semibold flex items-center border-b border-b-neutral-200 fixed z-100 w-full bg-white"
  >
    <NavLogo class="w-30" />
  </header>
  <main>
    <section class="w-full grid lg:grid-cols-2 items-start">
      <div class="bg-neutral-100 h-[calc(100dvh-3rem)] mt-12 hidden lg:block sticky top-12">
        <HeroImage :type="currentType" />
      </div>
      <div
        class="px-4 sm:px-8 py-12 w-full max-w-200 justify-self-center grid grid-cols-1 gap-8 mt-8 sm:mt-10"
      >
        <div>
          <h1>Find your next ride.</h1>
          <p>See your recommended size and shop available bikes.</p>
        </div>
        <Divider />
        <div>
          <div class="heading-group">
            <h2>Calculate bike size</h2>
          </div>

          <div class="rounded-md grid grid-cols-1 gap-6 mb-12">
            <div>
              <div class="heading-group">
                <h3>Bike type</h3>
              </div>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="bike in bikeTypes"
                  @click="selectType(bike)"
                  class="px-4 py-2 rounded-sm"
                  :class="
                    currentType === bike
                      ? 'bg-neutral-950 text-white'
                      : 'bg-neutral-200/75 text-black hover:bg-neutral-200'
                  "
                >
                  {{ bike }}
                </button>
              </div>
            </div>
            <div>
              <div class="heading-group">
                <h3>Measurements</h3>
                <p
                  v-if="currentType === 'Road'"
                  class="text-sm italic text-neutral-600 leading-none mt-1"
                  >Your size will be calculated by your inseam.</p
                >
                <p v-else class="text-sm italic text-neutral-600 leading-none mt-1"
                  >Your size will be calculated by your height.</p
                >
              </div>
              <fieldset class="grid grid-cols-2 gap-1 mb-2">
                <legend class="mb-1 text-neutral-700 text-sm font-medium">Height</legend>
                <label
                  >Feet
                  <input
                    v-model.number="currentFeet"
                    name="feet"
                    type="number"
                    :disabled="currentType === 'Road'"
                  />
                </label>
                <label
                  >Inches
                  <input
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
                    v-model.number="currentInseam"
                    name="inseam"
                    type="number"
                    step="0.1"
                    :disabled="currentType !== 'Road'"
                  />
                </label>
              </fieldset>
            </div>
          </div>

          <div class="px-6 py-4 border border-neutral-800 rounded-sm">
            <span class="uppercase text-xs font-mono text-neutral-500 mb-3 tracking-wider"
              >Recommended size</span
            >
            <div class="flex items-baseline gap-2 font-semibold text-neutral-800 mb-6">
              <div class="text-7xl sm:text-[6rem] leading-none text-neutral-950">
                <span v-if="currentSize.alphaSize">{{ currentSize.alphaSize }}</span>
                <template v-else>
                  <span class="text-neutral-950/50">N/A</span>
                  <p class="text-neutral-950 text-base font-medium leading-tight mt-2"
                    >Oh no! We couldn't find a match! <a class="text-link">Contact support</a> for
                    direct help.</p
                  >
                </template>
              </div>

              <span class="text-neutral-500" v-if="currentSize.alphaSize && currentType === 'Road'">
                <span class="mr-0.5">/</span>
                {{ currentSize.cmSize }}cm
              </span>
            </div>
            <div>
              <div class="heading-group">
                <h3>Sizing Notes</h3>
              </div>
              <ul class="flex flex-col gap-2 text-neutral-700">
                <template v-if="currentType === 'Road'">
                  <li
                    >See our <a class="text-link" href="">measuremment guide</a> to ensure you are
                    capturing your inseam correctly.</li
                  >
                </template>
                <template v-else-if="currentType === 'MTB'">
                  <li
                    >When shopping mountain bikes, we recommend reviewing the Reach and Effective
                    Top Tube measurements in the geometry chart found on each detail page.</li
                  >
                  <li
                    >If you have a relatively long torso or arms for your height, you may find that
                    a longer reach gives you a roomier, more comfortable cockpit. If you have a
                    relatively short torso or arms for your height, you may find that a shorter
                    reach makes it easier for you to hold the handlebars comfortably.</li
                  >
                </template>
                <template v-else-if="currentType === 'City'">
                  <li>Sizing may vary depending on your city/hybrid bike choice.</li>
                </template>
                <template v-if="currentType !== 'MTB'"
                  ><li
                    >Hovering between sizes? Go smaller for a sportier feel, and larger for a
                    comfier, touring-style ride.
                  </li></template
                >
                <li
                  >If you have questions about the measuring process or whether sizing up or down
                  would be good for your riding style, let's talk! Call Customer Service or connect
                  with your local retailer.</li
                >
              </ul>
            </div>
          </div>
        </div>

        <Divider />
        <!-- Carousel for shopping bikes of the current type -->
        <div>
          <div class="embla">
            <div class="heading-group flex items-center justify-between">
              <h2>Shop related bikes</h2>
              <div v-if="currentBikeList.length > 2">
                <button
                  @click="scrollPrev"
                  class="embla__prev rounded-sm p-2 hover:cursor-pointer bg-neutral-200/75 text-black hover:bg-neutral-200 mr-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="scrollNext"
                  class="embla__next rounded-sm p-2 hover:cursor-pointer bg-neutral-200/75 text-black hover:bg-neutral-200"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="#000000"
                    viewBox="0 0 256 256"
                  >
                    <path
                      d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div ref="emblaRef" class="embla__viewport">
              <div v-if="currentBikeList.length > 0" class="embla__container">
                <div v-for="bike in currentBikeList" :key="bike.name" class="embla__slide">
                  <BikeCard :bike="bike" />
                </div>
              </div>
              <p v-else class="text-lg text-neutral-950/50 mt-2"
                >No matching bikes found. For more choices,
                <a href="" class="text-link">shop all bikes</a>.</p
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.embla {
  --slide-size: 50%;
  --slide-spacing: 1rem;
}

.embla__viewport {
  overflow: hidden;
}

.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}

.embla__slide {
  flex: 0 0 var(--slide-size);
  min-width: 0;
  padding-left: var(--slide-spacing);
}

.embla__prev:disabled,
.embla__next:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
