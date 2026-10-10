<script setup lang="ts">
import { supabase } from '../utils/supabaseClient.ts'
import { ref, onMounted, computed } from 'vue'
import { formatPrice, validateKey, getRawPrice } from '@/utils/formatPrice.ts'
import { createImgSrc } from '@/utils/imageSrc.ts'
import { hideSkeleton } from '@/utils/hideSkeleton.ts'

import Button from '@/components/ui/Button.vue'
import InputWrapper from '@/components/ui/InputWrapper.vue'
import InputLabel from '@/components/ui/InputLabel.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Skeleton from '@/components/ui/Skeleton.vue'

import type { Ref } from 'vue'
import type { Tables } from '../utils/supabase.ts'
import Divider from '@/components/ui/Divider.vue'
import Checkbox from '@/components/ui/Checkbox.vue'

const bikes: Ref<Tables<'bikes'>[] | null> = ref([])

// Add bike refs
const bikeId = ref<number>()
const bikeName = ref('')
const bikePrice = ref('')
const bikeSalePrice = ref('')
const formattedPrice = computed(() => formatPrice(Number(bikePrice.value))) // For price input styling
const formattedSalePrice = computed(() => formatPrice(Number(bikeSalePrice.value))) // For sale price
const bikeTypes = ['Road', 'MTB', 'City']
const currentType = ref('')
const bikeImageFile = ref<File>()
const bikeImagePath = ref('')
const bikeInStock = ref(true)
const bikeOnSale = ref(false)

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
    in_stock: bikeInStock.value,
    main_image: bikeImagePath.value,
    on_sale: bikeOnSale.value,
    sale_price: Number(bikeSalePrice.value) ?? null,
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
  let currentBike
  if (id) {
    const { data } = await supabase.from('bikes').select().eq('id', id)
    currentBike = data ? data[0] : null
    formHeading.value = 'Manage bike'
    submitText.value = 'Update'
    editingBike.value = true
  } else {
    formHeading.value = 'Add bike'
    submitText.value = 'Add'
    editingBike.value = false
  }

  bikeId.value = currentBike?.id ?? undefined
  bikeName.value = currentBike?.name ?? ''
  currentType.value = currentBike?.bike_type ?? ''
  bikePrice.value = currentBike?.price.toString() ?? ''
  bikeImagePath.value = currentBike?.main_image ?? ''
  bikeInStock.value = currentBike?.in_stock ?? false
  bikeOnSale.value = currentBike?.on_sale ?? false
  bikeSalePrice.value = currentBike?.sale_price?.toString() ?? ''

  formVisible.value = true
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
  <main class="relative px-4" :class="[formVisible ? 'no-scroll' : null]">
    <div class="mx-auto max-w-5xl py-12">
      <div class="mb-4 flex items-center justify-between">
        <h1 class="mb-0! text-2xl!">Manage bikes</h1>
        <Button @click="setForm()">New bike</Button>
      </div>
      <div class="rounded-md border border-neutral-950/50 px-4 lg:px-8 lg:py-4">
        <div
          v-for="bike in bikes"
          :key="bike.id"
          class="flex items-center justify-between gap-6 border-b border-neutral-950/20 py-3 last:border-0 lg:py-6"
        >
          <div class="flex shrink items-center gap-4 overflow-hidden">
            <div
              class="relative aspect-4/3 w-25 flex-none overflow-hidden rounded-lg bg-neutral-100 p-3"
            >
              <Skeleton :id="bike.id.toString()" />
              <img
                @load="hideSkeleton(bike.id)"
                v-if="bike.main_image"
                :src="createImgSrc(bike.main_image)"
                alt=""
              />
            </div>
            <div class="overflow-hidden">
              <span v-if="!bike.in_stock" class="block text-xs font-semibold text-red-700 uppercase"
                >Out of stock</span
              >
              <h2 class="overflow-hidden text-base! text-nowrap text-ellipsis md:text-lg!">{{
                bike.name
              }}</h2>
              <span v-if="bike.on_sale && bike.sale_price" class="mr-2 text-neutral-950">{{
                formatPrice(bike.sale_price)
              }}</span>
              <span
                class="text-sm md:text-base"
                :class="bike.on_sale && 'text-neutral-950/45 line-through'"
                >{{ formatPrice(bike.price) }}</span
              >
            </div>
          </div>
          <Button size="sm" @click="setForm(bike.id)">Edit</Button>
        </div>
      </div>
      <div
        @click.self="formVisible = false"
        class="transform-opacity fixed right-0 bottom-0 left-0 flex h-[calc(100dvh-3rem)] items-end justify-center bg-white/90 duration-200 lg:items-center"
        :class="[formVisible ? 'opacity-100' : 'pointer-events-none opacity-0']"
      >
        <div
          class="z-1 max-h-[70dvh] w-full overflow-auto rounded-t-2xl border border-neutral-950/20 bg-white p-4 shadow-2xl duration-400 ease-in-out max-lg:inset-shadow-sm lg:max-h-[85dvh] lg:max-w-135 lg:rounded-xl lg:p-8"
          :class="[formVisible ? 'opacity-100' : 'translate-y-5 opacity-0']"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="">{{ formHeading }}</h2>
            <button @click="formVisible = false" class="">Close</button>
          </div>
          <form @submit.prevent="onSubmit" class="grid grid-cols-1 gap-4">
            <InputWrapper>
              <InputLabel label-for="name">Name</InputLabel>
              <Input v-model="bikeName" id="name" />
            </InputWrapper>
            <InputWrapper>
              <InputLabel label-for="type">Bike type</InputLabel>
              <Select v-model="currentType" name="type" id="type">
                <option v-for="bike in bikeTypes" :value="bike">{{ bike }}</option>
              </Select>
            </InputWrapper>
            <InputWrapper>
              <InputLabel label-for="price">Price</InputLabel>
              <Input
                v-model="formattedPrice"
                @keydown="(e: KeyboardEvent) => validateKey(e, bikePrice)"
                @input="(e: InputEvent) => (bikePrice = getRawPrice(e))"
                id="price"
                inputmode="numeric"
              />
            </InputWrapper>

            <div class="relative mb-4 flex w-full items-end gap-4">
              <div class="flex aspect-4/3 w-50 overflow-hidden rounded-lg bg-neutral-100 p-3">
                <img v-if="bikeImagePath" :src="createImgSrc(bikeImagePath)" alt="" />
                <span v-else class="w-full self-center text-center text-sm">No image found.</span>
              </div>
              <div>
                <InputLabel label-for="image">Main Image</InputLabel>
                <p class="mb-4 text-sm text-neutral-950/80 italic"
                  >Max recommended file size: <span class="whitespace-nowrap">100 kB</span></p
                >
                <div class="relative">
                  <input
                    @change="setBikeImage"
                    type="file"
                    id="image"
                    accept="image/*"
                    class="absolute inset-0 z-1 opacity-0 file:hidden hover:cursor-pointer"
                  />
                  <Button variant="secondary" type="button">Choose file</Button>
                </div>
              </div>
            </div>

            <Divider />

            <fieldset class="grid grid-cols-1 gap-4">
              <legend>
                <h3 class="heading-group">Inventory Settings</h3>
              </legend>
              <div class="flex items-center gap-2">
                <Checkbox
                  id="stock"
                  :checked="bikeInStock"
                  @change="() => (bikeInStock = !bikeInStock)"
                />
                <InputLabel label-for="stock">In-stock</InputLabel>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox
                  id="sale"
                  :checked="bikeOnSale"
                  @change="() => (bikeOnSale = !bikeOnSale)"
                />
                <InputLabel label-for="sale">On sale</InputLabel>
              </div>
              <InputWrapper>
                <InputLabel label-for="sale-price">Sale Price</InputLabel>
                <Input
                  v-model="formattedSalePrice"
                  @keydown="(e: KeyboardEvent) => validateKey(e, bikeSalePrice)"
                  @input="(e: InputEvent) => (bikeSalePrice = getRawPrice(e))"
                  id="sale-price"
                  inputmode="numeric"
                  :disabled="!bikeOnSale"
                />
              </InputWrapper>
            </fieldset>

            <div class="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:justify-self-start">
              <Button type="submit">{{ submitText }}</Button>
              <Button variant="danger" v-if="editingBike" @click="deleteBike" type="button"
                >Delete</Button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
