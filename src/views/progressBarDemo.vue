<script setup>
import progressBarSetting from '../components/progressBarSetting.vue'
</script>

<template>
  <div class="container">
    <h1>Демонстрация кругового прогресс-бара</h1>
    <progressBarSetting storageKey="bar" />
    <progressBarSetting storageKey="bar1" />
  </div>
</template>

<style>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.controls {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.control-group {
  margin-bottom: 15px;
}

.control-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.control-group input[type="range"] {
  width: 100%;
}

.progress-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

</style>