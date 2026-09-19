<script setup lang="ts">
import { getRoadSize, getMtbSize, getCitySize } from '../utils/getSizes'
import { ref, computed, watch, onMounted } from 'vue'
import type { Ref } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import { supabase } from '../utils/supabaseClient.ts'

import Divider from '../components/Divider.vue'
import NavLogo from '../components/NavLogo.vue'
import HeroImage from '../components/HeroImage.vue'
import type { Tables } from '../utils/supabase.ts'
import BikeCard from '../components/BikeCard.vue'

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
  <main id="main" aria-labelledby="main-heading">
    <div class="grid w-full items-start lg:grid-cols-2">
      <div class="sticky top-12 hidden h-[calc(100dvh-3rem)] bg-neutral-100 lg:block">
        <HeroImage :type="currentType" />
      </div>
      <div class="grid w-full max-w-200 grid-cols-1 gap-8 justify-self-center px-4 py-12 sm:px-8">
        <div>
          <h1 id="main-heading">Find your next ride.</h1>
          <p>See your recommended size and shop available bikes.</p>
        </div>
        <Divider />
        <section aria-labelledby="calc-heading">
          <div class="heading-group">
            <h2 id="calc-heading">Calculate bike size</h2>
          </div>

          <div class="mb-12 grid grid-cols-1 gap-6 rounded-md">
            <fieldset>
              <legend>
                <h3 class="heading-group">Bike type</h3>
              </legend>
              <div class="grid grid-cols-3 gap-1.5">
                <div v-for="bike in bikeTypes" :key="bike" class="relative">
                  <label
                    :for="bike"
                    aria-hidden="true"
                    class="label-btn relative z-2 block rounded-sm px-4 py-2 text-center"
                    :class="
                      currentType === bike
                        ? 'bg-neutral-950 text-white'
                        : 'bg-neutral-200/75 text-black hover:bg-neutral-200'
                    "
                    >{{ bike }}</label
                  >
                  <input
                    :id="bike"
                    :aria-label="bike === 'MTB' ? 'Mountain Bike' : bike"
                    name="bike-type"
                    type="radio"
                    v-model="currentType"
                    :value="bike"
                    class="type-input absolute -inset-0.75 appearance-none rounded-sm outline-hidden focus-visible:border-2 focus-visible:border-neutral-950"
                  />
                </div>
              </div>
            </fieldset>
            <div>
              <div class="heading-group">
                <h3>Measurements</h3>
                <p
                  v-if="currentType === 'Road'"
                  class="mt-1 text-sm leading-none text-neutral-600 italic"
                  >Your size will be calculated by your inseam.</p
                >
                <p v-else class="mt-1 text-sm leading-none text-neutral-600 italic"
                  >Your size will be calculated by your height.</p
                >
              </div>
              <fieldset class="mb-2 grid grid-cols-2 gap-1">
                <legend class="mb-1 text-sm font-medium text-neutral-700">Height</legend>
                <div class="input-wrapper">
                  <label for="height-ft" class="base-label">Feet </label>
                  <input
                    v-model.number="currentFeet"
                    id="height-ft"
                    name="feet"
                    type="number"
                    :disabled="currentType === 'Road'"
                  />
                </div>
                <div class="input-wrapper">
                  <label for="height-in" class="base-label">Inches </label>
                  <input
                    v-model.number="currentInches"
                    id="height-in"
                    name="inches"
                    type="number"
                    min="0"
                    max="11"
                    :disabled="currentType === 'Road'"
                  />
                </div>
              </fieldset>
              <fieldset>
                <legend class="mb-1 text-sm font-medium text-neutral-700">Inseam</legend>
                <div class="input-wrapper">
                  <label for="inseam" class="base-label">Inches </label>
                  <input
                    id="inseam"
                    v-model.number="currentInseam"
                    name="inseam"
                    type="number"
                    step="0.1"
                    :disabled="currentType !== 'Road'"
                  />
                </div>
              </fieldset>
            </div>
          </div>

          <div class="rounded-sm border border-neutral-800 px-6 py-4">
            <h3
              class="size-heading mt-1.5 mb-0.5 font-mono text-xs tracking-wider text-neutral-500 uppercase"
              >Recommended size</h3
            >
            <div class="mb-6 flex items-baseline gap-2 font-semibold text-neutral-800">
              <div aria-live="polite" class="text-7xl leading-none text-neutral-950 sm:text-[6rem]">
                <template v-if="currentSize.alphaSize">
                  <span aria-hidden="true">{{ currentSize.alphaSize }}</span>
                  <span class="sr-only">Recommended size is {{ currentSize.ariaLabel }}</span>
                </template>

                <template v-else>
                  <span aria-hidden="true" class="text-neutral-950/50">N/A</span>
                  <p class="mt-2 text-base leading-tight font-medium text-neutral-950"
                    >Oh no! We couldn't find a match!
                    <a @click.prevent href="#" aria-disabled="true" class="text-link">
                      Contact support for direct help.
                    </a>
                  </p>
                </template>
              </div>

              <span
                aria-hidden="true"
                class="text-neutral-500"
                v-if="currentSize.alphaSize && currentType === 'Road'"
              >
                <span class="mr-0.5">/</span>
                {{ currentSize.cmSize }}cm
              </span>
            </div>
            <div>
              <div class="heading-group">
                <h4>Sizing Notes</h4>
              </div>
              <ul class="flex flex-col gap-2 text-neutral-700">
                <template v-if="currentType === 'Road'">
                  <li
                    >Ensure you are capturing your inseam correctly.
                    <a @click.prevent href="#" aria-disabled="true" class="text-link">
                      See our measurement guide for details.
                    </a>
                  </li>
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
        </section>

        <Divider />
        <!-- Carousel for shopping bikes of the current type -->
        <section aria-labelledby="shop-heading">
          <div class="embla">
            <div class="heading-group flex items-center justify-between">
              <h2 id="shop-heading">Shop related bikes</h2>
              <div v-if="currentBikeList.length > 2">
                <button
                  @click="scrollPrev"
                  aria-label="Previous slide"
                  class="embla__prev mr-2 rounded-sm bg-neutral-200/75 p-2 text-black hover:cursor-pointer hover:bg-neutral-200"
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
                  aria-label="Next slide"
                  class="embla__next rounded-sm bg-neutral-200/75 p-2 text-black hover:cursor-pointer hover:bg-neutral-200"
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
              <p v-else class="mt-2 text-lg text-neutral-950/50"
                >No matching bikes found.
                <a @click.prevent href="#" aria-disabled="true" class="text-link">
                  Shop the rest of our inventory.
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
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
