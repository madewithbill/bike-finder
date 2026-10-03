<script setup lang="ts">
import router from '@/router'
import { supabase } from '@/utils/supabaseClient'
import { ref } from 'vue'

import InputWrapper from '@/components/ui/InputWrapper.vue'
import InputLabel from '@/components/ui/InputLabel.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const email = ref('')
const password = ref('')
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
            <InputWrapper>
              <InputLabel label-for="email">Email</InputLabel>
              <Input v-model="email" id="email" name="email" type="text" />
            </InputWrapper>
            <InputWrapper>
              <InputLabel label-for="password">Password</InputLabel>
              <Input
                v-model="password"
                id="password"
                name="password"
                :type="passwordVisible ? 'text' : 'password'"
              />
              <button
                @click="passwordVisible = !passwordVisible"
                class="absolute top-[50%] right-2 translate-y-[-50%] rounded-md border border-neutral-950/20 bg-neutral-100 px-2 py-1 text-xs"
                ><span v-if="!passwordVisible">Show</span><span v-else>Hide</span></button
              >
            </InputWrapper>
            <Button class="justify-self-start">Log in</Button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
