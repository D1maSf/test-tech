<script setup>
import {ref} from "vue";
import progressBar from '../components/progressBar.vue'

const progress = ref({
  progressValue: 0,
  value: 0,
  status: 'in-progress',
  type: 'default',
  size: 300,
  showText: true,
  showStatusIcon: true
});
</script>

<template>

  <div class="controls">
    <div class="control-group">
      <label>Значение: {{ progress.progressValue }}%</label>
      <input type="range" v-model.number="progress.progressValue" min="0" max="100">
    </div>

    <div class="control-group">
      <label>Статус:</label>
      <select v-model="progress.status">
        <option value="in-progress">В процессе</option>
        <option value="success">Успех</option>
        <option value="warning">Предупреждение</option>
        <option value="error">Ошибка</option>
      </select>
    </div>

    <div class="control-group">
      <label>Тип:</label>
      <select v-model="progress.type">
        <option value="default">Полный круг</option>
        <option value="dashboard">Dashboard (с зазором)</option>
      </select>
    </div>
  </div>

  <div class="progress-container">
    <progressBar
        :value="progress.progressValue"
        :size="progress.size"
        :status="progress.status"
        :type="progress.type"
        :show-text="progress.showText"
        :show-status-icon="progress.showStatusIcon"
    />
  </div>
</template>

<style scoped>

</style>