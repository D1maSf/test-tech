<script setup>
import pieChart from '../components/pieChart.vue'
</script>

<template>
  <div class="section">
    <div class="container">
         <router-link
        to="/"
        class="btn btn--default"
    >
      Home
    </router-link>
    <h1 class="page-title">Круговая диаграмма (Vuex)</h1>

    <pieChart />
    </div>
  </div>
</template>

<style>
.pie-chart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.chart-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}

.chart-wrapper {
  flex: 1;
  min-width: 300px;
  height: 400px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-container {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.data-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  padding: 10px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

.data-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.list-title {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.data-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-color {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.item-label {
  font-weight: 500;
}

.item-value {
  color: #666;
}

.item-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
}

.edit-btn:hover {
  color: #2196F3;
}

.remove-btn:hover {
  color: #f44336;
}

.empty-state {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #666;
}

@media (max-width: 768px) {
  .chart-container {
    flex-direction: column;
  }

  .chart-wrapper {
    height: 300px;
  }
}
</style>