<script setup lang="ts">
import { supabase } from './utils/supabaseClient.ts'
import NavLogo from './components/NavLogo.vue'
import { onMounted, ref } from 'vue'
import router from './router.ts'
import { RouterLink } from 'vue-router'

const isAuthenticated = ref(false)

onMounted(() => {
  const { data } = supabase.auth.onAuthStateChange((e) => {
    if (e === 'SIGNED_IN') {
      isAuthenticated.value = true
    }
    if (e === 'SIGNED_OUT') {
      isAuthenticated.value = false
    }
  })
})

async function signOut() {
  const { error } = await supabase.auth.signOut()
  router.push({ path: '/' })
}
</script>

<template>
  <!--Once the project adds routing for multiple pages, a backToTop ref on a span should be incorporated as well.-->
  <ul class="relative z-999">
    <li class="before:content-none!">
      <a
        href="#main"
        class="fixed top-0 left-[50%] mx-auto my-[1em] -ml-18 whitespace-nowrap opacity-0 focus:bg-neutral-950 focus:p-2 focus:text-white focus:opacity-100"
        >Skip to main content</a
      >
    </li>
  </ul>
  <header
    class="sticky top-0 z-100 flex h-12 w-full items-center justify-between border-b border-b-neutral-200 bg-white px-4"
  >
    <div class="flex h-full items-center gap-3">
      <NavLogo class="w-30" />
      <template v-if="isAuthenticated">
        <div class="h-4 w-px bg-neutral-950"></div>
        <RouterLink :to="{ name: 'manage' }" class="text-sm text-neutral-700">Admin</RouterLink>
      </template>
    </div>
    <button
      v-if="isAuthenticated"
      @click="signOut"
      class="h-7 rounded-sm border border-neutral-700 px-2 text-sm leading-0 text-neutral-700"
      >Sign Out</button
    >
  </header>
  <RouterView />
</template>
