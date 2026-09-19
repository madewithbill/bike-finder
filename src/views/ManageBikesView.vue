<script setup lang="ts">
import { supabase } from '../utils/supabaseClient.ts'
import { ref, onMounted, useTemplateRef } from 'vue'
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
const bikeFormWrapper = useTemplateRef('bikeFormWrapper')
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
  formVisible.value = false
  bikeFormWrapper.value?.addEventListener('transitionend', () => {
    bikeName.value = ''
    currentType.value = ''
    bikePrice.value = ''
    bikeImagePath.value = ''
  })
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
</script>
<template>
  <main class="relative">
    <h1>Manage bikes in the database</h1>
    <div>
      <button @click="setForm()">Add a bike</button>
      <div
        v-for="bike in bikes"
        :key="bike.id"
        class="flex items-center justify-between gap-6 border-b border-neutral-400 px-4 py-6"
      >
        <div class="flex shrink items-center gap-4 overflow-hidden">
          <div class="aspect-4/3 w-25 flex-none rounded-lg bg-neutral-100 p-3">
            <img v-if="bike.main_image" :src="createImgSrc(bike.main_image)" alt="" />
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
      ref="bikeFormWrapper"
      class="fixed bottom-0 z-1 w-full overflow-hidden rounded-t-2xl border border-neutral-950/20 bg-white px-4 py-8 shadow-2xl transition-transform duration-400 ease-in-out lg:bottom-[7.5dvh] lg:h-[85dvh] lg:max-w-xl lg:rounded-xl"
      :class="[
        formVisible ? 'lg:right-4' : 'max-lg:translate-y-full lg:right-0 lg:translate-x-full',
      ]"
    >
      <button @click="resetForm" class="absolute top-4 right-4">Close</button>
      <form @submit.prevent="onSubmit">
        <h2 class="mb-2">{{ formHeading }}</h2>
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
        <img class="mb-2 w-40" :src="bikeImagePath" alt="" />
        <div class="input-wrapper">
          <label for="">Main image</label>
          <input @change="setBikeImage" type="file" accept="image/*" />
        </div>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <button type="submit">{{ submitText }}</button>
          <button v-if="editingBike" type="button" @click="deleteBike">Delete</button>
        </div>
      </form>
    </div>
  </main>
</template>
