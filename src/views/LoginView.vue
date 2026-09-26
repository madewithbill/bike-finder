<script setup lang="ts">
import router from '@/router'
import { supabase } from '@/utils/supabaseClient'
import { ref, useTemplateRef } from 'vue'

const email = ref('')
const password = ref('')
const passwordEl = useTemplateRef('pwEl')
const passwordVisible = ref(false)

async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (data.user?.role === 'authenticated') {
    email.value = ''
    password.value = ''
    router.push({ name: 'manage' })
  }
}

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value
  if (passwordEl.value) {
    passwordEl.value.type = passwordVisible.value ? 'text' : 'password'
  }
}
</script>

<template>
  <main id="main" aria-labelledby="main-heading">
    <div class="grid w-full items-start lg:grid-cols-2">
      <div class="sticky top-12 hidden h-[calc(100dvh-3rem)] bg-neutral-100 lg:block">
        <img class="size-full object-cover" src="../assets/images/login-hero.avif" alt="" />
      </div>
      <div
        class="grid size-full max-w-130 grid-cols-1 gap-8 justify-self-center px-4 py-12 sm:px-8"
      >
        <div class="self-center">
          <h1 class="mb-6!">Log in to Bikefinder Admin</h1>
          <form @submit.prevent="signInWithEmail" class="grid grid-cols-1 gap-4">
            <div class="input-wrapper">
              <label for="email">Email</label>
              <input v-model="email" id="email" name="email" type="text" />
            </div>
            <div class="input-wrapper">
              <label for="password">Password</label>
              <input ref="pwEl" v-model="password" id="password" name="password" type="password" />
              <button
                @click="togglePasswordVisible"
                class="absolute top-[50%] right-2 translate-y-[-50%] rounded-md border border-neutral-950/20 bg-neutral-100 px-2 py-1 text-xs"
                ><span v-if="!passwordVisible">Show</span><span v-else>Hide</span></button
              >
            </div>
            <button
              class="h-8 justify-self-start rounded-full bg-neutral-950 px-4 leading-0 text-white"
              >Log In</button
            >
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
