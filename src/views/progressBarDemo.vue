<script setup>
import {ref} from 'vue';
import progressBar from '../components/progressBar.vue'

const progressValue = ref(0);
const size = ref(200);
const status = ref('in-progress');
const type = ref('default');
const showText = ref(true);
const showStatusIcon = ref(true);
</script>

<template>
  <div class="container">
    <h1>Демонстрация кругового прогресс-бара</h1>

    <div class="controls">
      <div class="control-group">
        <label>Значение: {{ progressValue }}%</label>
        <input type="range" v-model.number="progressValue" min="0" max="100">
      </div>

      <div class="control-group">
        <label>Статус:</label>
        <select v-model="status">
          <option value="in-progress">В процессе</option>
          <option value="success">Успех</option>
          <option value="warning">Предупреждение</option>
          <option value="error">Ошибка</option>
        </select>
      </div>

      <div class="control-group">
        <label>Тип:</label>
        <select v-model="type">
          <option value="default">Полный круг</option>
          <option value="dashboard">Dashboard (с зазором)</option>
        </select>
      </div>
    </div>

    <div class="progress-container">
      <progressBar
          :value="progressValue"
          :size="size"
          :status="status"
          :type="type"
          :show-text="showText"
          :show-status-icon="showStatusIcon"
      />
    </div>

    <div class="examples">
      <h2>Примеры использования</h2>
      <div class="examples-content">
        <h3>Тип</h3>
        <div class="example-row">
          <div class="example">
            <h4>По умолчанию</h4>
            <progressBar :value="15"/>
          </div>
        </div>
        <h3>Статус</h3>
        <div class="example-row">
          <div class="example">
            <h4>Статус "Предупреждение"</h4>
            <progressBar status="warning"/>
          </div>

          <div class="example">
            <h4>Статус "Ошибка"</h4>
            <progressBar status="error"/>
          </div>

          <div class="example">
            <h4>Статус "Успех"</h4>
            <progressBar status="success"/>
          </div>
        </div>
      </div>
      <div>
        <h3>Тип</h3>
        <div class="example-row">
          <div class="example">
            <h4>Тип Dashboard</h4>
            <progressBar :value="50" type="dashboard"/>
          </div>
        </div>
        <h3>Статус</h3>
        <div class="example-row">
          <div class="example">
            <h4>Статус "Предупреждение"</h4>
            <progressBar :value="50" type="dashboard" status="warning"/>
          </div>

          <div class="example">
            <h4>Статус "Ошибка"</h4>
            <progressBar :value="50" type="dashboard" status="error"/>
          </div>

          <div class="example">
            <h4>Статус "Успех"</h4>
            <progressBar :value="50" type="dashboard" status="success"/>
          </div>
        </div>
      </div>


    </div>
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

.examples {
  margin-top: 40px;
}

.example-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 200px;
  text-align: center;
  margin: 10px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.example h3 {
  margin-top: 0;
  color: #555;
}
</style>