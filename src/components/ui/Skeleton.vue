<template>
  <div
    class="absolute inset-0 z-10 animate-[loading_1.5s_infinite] bg-linear-[90deg,#f0f0f0_25%,#e0e0e0_50%,#f0f0f0_75%] bg-size-[200%_100%]"
  ></div>
</template>

<style>
@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
