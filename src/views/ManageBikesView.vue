<script setup lang="ts">
import { supabase } from '../utils/supabaseClient.ts'
import { ref, onMounted } from 'vue'
import { formatPrice } from '@/utils/formatPrice.ts'

import type { Ref } from 'vue'
import type { Tables } from '../utils/supabase.ts'

const bikes: Ref<Tables<'bikes'>[] | null> = ref([])

// Add bike refs
const bikeName = ref('')
const bikePrice = ref('')
const bikeTypes = ['Road', 'MTB', 'City']
const currentType = ref('')
const bikeImage = ref<File>()
const bikeImageUrl = ref('')

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
  bikeImage.value = imageInput.files?.[0]
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
    bikeImageUrl.value = bikes.getPublicUrl(`${file.name}`).data.publicUrl
  }
}

// Add new row to bikes table
async function addBike() {
  const { data, error } = await supabase.from('bikes').insert({
    name: bikeName.value,
    bike_type: currentType.value,
    price: Number(bikePrice.value) ?? 0,
    in_stock: true,
    main_image: bikeImageUrl.value,
    on_sale: false,
    sale_price: null,
  })
  if (error) {
    console.log(error)
  }
  getBikes()
}

// Form sumbit action to upload image and add row to table
async function onSubmit() {
  if (bikeImage.value) {
    uploadFile(bikeImage.value).then(() => addBike())
  } else {
    addBike()
  }
}
</script>
<template>
  <h1>Manage bikes in the database</h1>
  <div class="max-w-3xl"
    ><div v-for="bike in bikes" class="flex">
      <img v-if="bike.main_image" :src="bike.main_image" alt="" class="w-20 flex-none" />
      <div>
        <h2>{{ bike.name }}</h2>
        <p>{{ formatPrice(bike.price) }}</p>
      </div>
    </div>
  </div>
  <form @submit.prevent="onSubmit">
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
    <div class="input-wrapper">
      <label for="">Main image</label>
      <input @change="setBikeImage" type="file" accept="image/*" />
    </div>
    <button>Add bike</button>
  </form>
</template>
