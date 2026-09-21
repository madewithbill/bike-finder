<script setup lang="ts">
import { supabase } from '../utils/supabaseClient.ts'
import { ref, onMounted } from 'vue'
import { formatPrice } from '@/utils/formatPrice.ts'
import { createImgSrc } from '@/utils/imageSrc.ts'

import type { Ref } from 'vue'
import type { Tables } from '../utils/supabase.ts'

const bikes: Ref<Tables<'bikes'>[] | null> = ref([])

// Add bike refs
const bikeId = ref<number>()
const bikeName = ref('')
const bikePrice = ref('')
const bikeTypes = ['Road', 'MTB', 'City']
const currentType = ref('')
const bikeImageFile = ref<File>()
const bikeImagePath = ref('')

// Add form refs
const formVisible = ref(false)
const formHeading = ref('Add bike')
const submitText = ref('Add bike')
const editingBike = ref(false)

async function getBikes() {
  const { data } = await supabase.from('bikes').select()
  bikes.value = data
}

onMounted(() => {
  getBikes()
})

// Capture image file ref to ready for upload
function setBikeImage(e: Event) {
  const imageInput = e.target as HTMLInputElement
  bikeImageFile.value = imageInput.files?.[0]
  if (bikeImageFile.value) {
    bikeImagePath.value = URL.createObjectURL(bikeImageFile.value)
  }
}

// Upload file to Supabase Storage using standard upload
async function uploadFile(file: File) {
  const bikes = supabase.storage.from('bikes')
  const { data, error } = await bikes.upload(`${file.name}`, file)
  if (error) {
    // Handle error
    console.log(data, error)
  } else {
    // Handle success
    bikeImagePath.value = file.name
  }
}

// Add new row to bikes table
async function addBike() {
  const { data, error } = await supabase.from('bikes').upsert({
    id: bikeId.value,
    name: bikeName.value,
    bike_type: currentType.value,
    price: Number(bikePrice.value) ?? 0,
    in_stock: true,
    main_image: bikeImagePath.value,
    on_sale: false,
    sale_price: null,
  })
  if (error) {
    console.log(error)
  }
  getBikes()
}

async function deleteBike() {
  console.log('try delete')
  if (bikeId.value) {
    const { data, error } = await supabase.from('bikes').delete().eq('id', bikeId.value)
    if (error) {
      console.log(error)
    }
  }
  if (bikeImagePath.value) {
    const { data, error } = await supabase.storage.from('bikes').remove([bikeImagePath.value])
    if (error) {
      console.log(error)
    }
  }
  formVisible.value = false
  getBikes()
}

//Form fill
async function setForm(id?: number) {
  if (id) {
    const { data } = await supabase.from('bikes').select().eq('id', id)
    if (data) {
      const currentBike = data[0]
      bikeId.value = currentBike?.id
      bikeName.value = currentBike?.name ?? ''
      currentType.value = currentBike?.bike_type ?? ''
      bikePrice.value = currentBike?.price.toString() ?? ''
      bikeImagePath.value = currentBike?.main_image ?? ''
    }
    formHeading.value = 'Manage bike'
    submitText.value = 'Update'
    editingBike.value = true
  } else {
    formHeading.value = 'Add bike'
    submitText.value = 'Add'
    editingBike.value = false
  }
  formVisible.value = true
}

function resetForm() {
  if (!formVisible.value) {
    bikeName.value = ''
    currentType.value = ''
    bikePrice.value = ''
    bikeImagePath.value = ''
  }
}

// Form sumbit action to upload image and add row to table
async function onSubmit() {
  if (bikeImageFile.value) {
    uploadFile(bikeImageFile.value).then(() => addBike())
  } else {
    addBike()
  }
  formVisible.value = false
}

// Image skeloton replace
function revealImg(key: number) {
  const skeleton = document.getElementById(`${key}`)
  skeleton?.classList.add('hidden')
}
</script>
<template>
  <main
    class="relative px-4"
    :class="[formVisible ? 'h-[calc(100dvh-3rem)] overflow-hidden' : null]"
  >
    <div class="mx-auto max-w-5xl py-12">
      <div class="mb-4 flex items-center justify-between">
        <h1 class="mb-0! text-2xl!">Manage bikes</h1>
        <button
          class="h-8 rounded-full bg-neutral-950 px-4 text-sm leading-0 text-white"
          @click="setForm()"
          >New bike</button
        >
      </div>
      <div class="rounded-md border border-neutral-950/50 px-8 py-4">
        <div
          v-for="bike in bikes"
          :key="bike.id"
          class="flex items-center justify-between gap-6 border-b border-neutral-950/20 px-4 py-6 last:border-0"
        >
          <div class="flex shrink items-center gap-4 overflow-hidden">
            <div
              class="relative aspect-4/3 w-25 flex-none overflow-hidden rounded-lg bg-neutral-100 p-3"
            >
              <div :id="bike.id.toString()" class="skeleton absolute inset-0 z-1"></div>
              <img
                @load="revealImg(bike.id)"
                v-if="bike.main_image"
                :src="createImgSrc(bike.main_image)"
                alt=""
              />
            </div>
            <div class="overflow-hidden">
              <h2 class="overflow-hidden text-base! text-nowrap text-ellipsis md:text-lg!">{{
                bike.name
              }}</h2>
              <p class="text-sm md:text-base">{{ formatPrice(bike.price) }}</p>
            </div>
          </div>
          <button
            @click="setForm(bike.id)"
            class="flex-none rounded-full bg-neutral-950 px-3 py-1 text-sm text-white"
            >Edit</button
          >
        </div>
      </div>
      <div
        @click.self="formVisible = false"
        class="transform-opacity absolute inset-0 flex h-[calc(100dvh-3rem)] items-end justify-center bg-neutral-950/20 duration-200 lg:items-center"
        :class="[formVisible ? 'opacity-100' : 'pointer-events-none opacity-0']"
      >
        <div
          @transitionend="resetForm"
          class="z-1 w-full overflow-auto rounded-t-2xl border border-neutral-950/20 bg-white px-6 py-8 shadow-2xl duration-400 ease-in-out lg:max-h-[85dvh] lg:max-w-xl lg:rounded-xl"
          :class="[formVisible ? 'opacity-100' : 'translate-y-5 opacity-0']"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="">{{ formHeading }}</h2>
            <button @click="formVisible = false" class="">Close</button>
          </div>
          <form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-4">
            <div class="input-wrapper">
              <label for="">Name</label>
              <input v-model="bikeName" type="text" name="" id="" />
            </div>
            <div class="input-wrapper">
              <label for="">Select type</label>
              <select v-model="currentType" name="" id="">
                <option v-for="bike in bikeTypes" :value="bike">{{ bike }}</option>
              </select>
            </div>
            <div class="input-wrapper">
              <label for="price">Price</label>
              <input
                @keydown.prevent="
                  (e) => {
                    if (Number(e.key)) {
                      bikePrice += e.key
                    }
                  }
                "
                :value="formatPrice(Number(bikePrice))"
                type="text"
                inputmode="numeric"
                name=""
                id="price"
              />
            </div>
            <div class="mb-2 flex aspect-4/3 w-40 overflow-hidden rounded-lg bg-neutral-100 p-3">
              <img v-if="bikeImagePath" :src="createImgSrc(bikeImagePath)" alt="" />
              <span v-else class="w-full self-center text-center text-sm">No image found.</span>
            </div>
            <div class="input-wrapper upload">
              <label for="">Main image</label>
              <input
                @change="setBikeImage"
                type="file"
                accept="image/*"
                class="file:hidden hover:cursor-pointer"
              />
            </div>
            <div class="mt-2 grid grid-cols-2 gap-2 justify-self-start">
              <button
                type="submit"
                class="h-8 rounded-full bg-neutral-950 px-4 text-sm text-white"
                >{{ submitText }}</button
              >
              <button
                v-if="editingBike"
                type="button"
                @click="deleteBike"
                class="h-8 rounded-full bg-red-700 px-4 text-sm text-white"
                >Delete</button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
