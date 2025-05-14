<script setup>
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import '@fortawesome/fontawesome-free/css/all.css';

const router = useRouter();
</script>

<template>
  <div id="app">
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main {
  padding: 20px;
}
</style>