<script setup>
import progressBar from './components/progressBar.vue'

import { ref } from 'vue'

const progress = ref(40)
const status = ref('in-progress')
</script>

<template>
  <div class="main">
    <div class="section">
<router-view/>
    </div>
  </div>

</template>


<style scoped>
body {
  background-color: white !important;
}
</style>
