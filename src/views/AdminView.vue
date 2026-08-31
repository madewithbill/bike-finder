<script setup lang="ts"></script>

<template>
  <h1>Admin Route!</h1>
  <RouterLink :to="{ name: 'manage' }">Manage bikes</RouterLink>
  <RouterLink :to="{ name: 'addBike' }">Add a bike</RouterLink>
</template>
