<script setup>
import { ref, watch } from 'vue'
import progressBar from './progressBar.vue'

const props = defineProps({
  storageKey: {
    type: String,
    required: true
  }
})

const saved = localStorage.getItem(props.storageKey)
const settings = ref(saved ? JSON.parse(saved) : {
  progressValue: 0,
  status: 'in-progress',
  type: 'default',
  size: 300,
  showText: true,
  showStatusIcon: true
})

watch(settings, (newVal) => {
  localStorage.setItem(props.storageKey, JSON.stringify(newVal))
}, { deep: true })

</script>

<template>
  <div class="controls">
    <div class="control-group">
      <label>Значение: {{ settings.progressValue }}%</label>
      <input type="range" v-model.number="settings.progressValue" min="0" max="100">
    </div>

    <div class="control-group">
      <label>Статус:</label>
      <select v-model="settings.status">
        <option value="in-progress">В процессе</option>
        <option value="success">Успех</option>
        <option value="warning">Предупреждение</option>
        <option value="error">Ошибка</option>
      </select>
    </div>

    <div class="control-group">
      <label>Тип:</label>
      <select v-model="settings.type">
        <option value="default">Полный круг</option>
        <option value="dashboard">Dashboard (с зазором)</option>
      </select>
    </div>
  </div>

  <div class="progress-container">
    <progressBar
        :value="settings.progressValue"
        :status="settings.status"
        :type="settings.type"
        :size="settings.size"
        :show-text="settings.showText"
        :show-status-icon="settings.showStatusIcon"
    />
  </div>
</template>

<style scoped>
.settings {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>