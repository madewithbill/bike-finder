<script setup lang="ts">
import { supabase } from '../utils/supabaseClient.ts'
import { ref, onMounted, computed } from 'vue'
import { formatPrice } from '@/utils/formatPrice.ts'

import type { Events, Ref } from 'vue'
import type { Tables } from '../utils/supabase.ts'

const bikes: Ref<Tables<'bikes'>[] | null> = ref([])

//add bike refs
// const newBikeId = computed(() => bikes.value?.length)
const bikeName = ref('')
const bikePrice = ref<number>()
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

function onChange(e: Event) {
  console.log((e.target as HTMLInputElement).files)
}

// Upload file using standard upload
async function uploadFile(file: File) {
  const bikes = supabase.storage.from('bikes')
  const { data, error } = await bikes.upload(`${file.name}`, file)
  if (error) {
    console.log(data, 'there was a problem')
    // Handle error
  } else {
    // console.log(bikes.getPublicUrl(`${file.name}`).data.publicUrl)
    bikeImageUrl.value = bikes.getPublicUrl(`${file.name}`).data.publicUrl
    // Handle success
  }
}

function setBikeImage(e: Event) {
  const imageInput = e.target as HTMLInputElement
  bikeImage.value = imageInput.files?.[0]
  console.log(bikeImage.value)
}
async function addBike() {
  const { data, error } = await supabase.from('bikes').insert({
    name: bikeName.value,
    bike_type: currentType.value,
    price: bikePrice.value ?? 0,
    in_stock: true,
    main_image: bikeImageUrl.value,
    on_sale: false,
    sale_price: null,
  })
  if (error) {
    console.log(error)
  }
  getBikes()
  console.log(data)
}

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
      <label for="">Price</label>
      <input
        v-model.number.lazy="bikePrice"
        type="number"
        name=""
        id=""
        step="0.01"
        placeholder="1500"
      />
    </div>
    <div class="input-wrapper">
      <label for="">Main image</label>
      <input @change="setBikeImage" type="file" accept="image/*" />
    </div>
    <button>Add bike</button>
  </form>
</template>
