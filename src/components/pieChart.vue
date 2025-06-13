<script setup>
import {ref, onMounted, computed} from 'vue';
import {useStore} from 'vuex';
import {Chart, PieController, ArcElement, Tooltip, Legend} from 'chart.js';
import {ColorPicker} from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const store = useStore();
const chartCanvas = ref(null);
const chartInstance = ref(null);
const editingIndex = ref(null);
const showModal = ref(false);

const form = ref({
  label: '',
  value: 1,
  color: '#3e95cd'
});

const pieData = computed(() => {
  console.log('[Computed pieData]', JSON.stringify(store.state.pieData));
  return store.state.pieData;
});

const dataCount = computed(() => {
  const count = store.getters.dataCount;
  console.log('[Computed dataCount]', count);
  return count;
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateScale: true,
    animateRotate: true
  },
  plugins: {
    tooltip: {
      callbacks: {
        label(context) {
          const data = context.dataset.data;
          const value = data[context.dataIndex];
          const sum = data.reduce((a, b) => a + b, 0);
          const percentage = sum ? ((value / sum) * 100).toFixed(2) : 0;
          const label = context.label || '';
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
};

console.log('pieData at init:', JSON.stringify(pieData.value));

onMounted(() => {
  console.log('[onMounted] Initializing chart');
  initChart();

  store.subscribe((mutation) => {
    console.log('[Store.subscribe] Mutation detected:', mutation.type);
    const types = ['ADD_DATA', 'UPDATE_DATA', 'REMOVE_DATA', 'RESET_DATA'];
    if (types.includes(mutation.type)) {
      updateChart();
    }
  });
});

const initChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  if (chartCanvas.value) {
    const data = {...pieData.value};
    const sum = data.datasets[0].data.reduce((a, b) => a + b, 0);

    const labels = [...data.labels];
    const datasetData = [...data.datasets[0].data];
    const backgroundColor = [...data.datasets[0].backgroundColor];

    if (sum < 100) {
      labels.push('Пусто');
      datasetData.push(100 - sum);
      backgroundColor.push('#e0e0e0'); // серый для пустой части
    }

    chartInstance.value = new Chart(chartCanvas.value, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: datasetData,
          backgroundColor
        }]
      },
      options: chartOptions
    });
  }
};

let previousDataLength = 0;

const updateChart = () => {
  if (!chartInstance.value) {
    initChart();
    return;
  }

  const {labels, datasets} = pieData.value;

  if (!datasets || datasets.length === 0 || !datasets[0]) {
    initChart();
    return;
  }

  const sum = datasets[0].data.reduce((a, b) => a + b, 0);
  const newLabels = [...labels];
  const newData = [...datasets[0].data];
  const newColors = [...datasets[0].backgroundColor];

  if (sum < 100) {
    newLabels.push('Пусто');
    newData.push(100 - sum);
    newColors.push('#e0e0e0');
  }

  try {
    chartInstance.value.data.labels = newLabels;
    chartInstance.value.data.datasets[0].data = newData;
    chartInstance.value.data.datasets[0].backgroundColor = newColors;
    chartInstance.value.update();
  } catch (e) {
    chartInstance.value.destroy();
    initChart();
  }
};

const handleSubmit = async () => {
  const newValue = Number(form.value.value);
  const currentData = [...pieData.value.datasets[0].data];
  const total = currentData.reduce((a, b) => a + b, 0);

  if (editingIndex.value === null) {
    if (total + newValue > 100) {
      alert('Сумма значений не может превышать 100%');
      return;
    }
    await store.dispatch('addData', {...form.value});
  } else {
    const oldValue = currentData[editingIndex.value];
    if (total - oldValue + newValue > 100) {
      alert('Сумма значений не может превышать 100%');
      return;
    }
    await store.dispatch('updateData', {
      index: editingIndex.value,
      data: {...form.value}
    });
    editingIndex.value = null;
  }

  resetForm();
  closeModal();
};

const editItem = (index) => {
  const dataset = pieData.value.datasets[0];
  if (!dataset) return;

  form.value.label = pieData.value.labels[index];
  form.value.value = dataset.data[index];
  form.value.color = dataset.backgroundColor[index];
  editingIndex.value = index;

  openModal();
};

const openModal = () => {
  showModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  showModal.value = false;
  editingIndex.value = null;
  resetForm();
  document.body.style.overflow = '';
};

const resetForm = () => {
  form.value = {
    label: '',
    value: 1,
    color: '#3e95cd'
  };
};

const removeItem = (index) => {
  console.log('[removeItem] Removing index:', index);
  store.dispatch('removeData', index);
  if (editingIndex.value === index) {
    cancelEdit();
  }
};

const cancelEdit = () => {
  console.log('[cancelEdit] Cancel editing');
  editingIndex.value = null;
  resetForm();
};
</script>

<template>
  <div class="pie-chart">
    <div class="data-controls">
      <div class="data-list">
        <h2 class="list-title">Список данных</h2>
        <ul>
          <li v-for="(item, index) in pieData.labels" :key="index" class="data-item">
            <div class="item-info">
              <span class="item-color" :style="{ backgroundColor: pieData.datasets[0].backgroundColor[index] }"></span>
              <span class="item-label">{{ item }}</span>
              <span class="item-value">{{ pieData.datasets[0].data[index] }}</span>
            </div>
            <div class="item-actions">
              <button @click="editItem(index)" class="edit-btn">✏️</button>
              <button @click="removeItem(index)" class="remove-btn">🗑️</button>
            </div>
          </li>
        </ul>
      </div>
      <button @click="openModal" class="add-btn">Добавить данные</button>
    </div>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>


    <!-- Модальное окно -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ editingIndex === null ? 'Добавить данные' : 'Редактировать данные' }}</h3>
        <form @submit.prevent="handleSubmit" class="data-form">
          <div class="form-group">
            <label>Название:</label>
            <input v-model="form.label" type="text" required/>
          </div>

          <div class="form-group">
            <label>Значение:</label>
            <input v-model.number="form.value" type="number" min="1" max="100" required/>
          </div>

          <div class="form-group">
            <label>Цвет:</label>
            <ColorPicker v-model:pureColor="form.color" format="hex" pickerType="chrome" :disableHistory="true"
                         :disableAlpha="true"/>
            <p>Выбранный цвет: {{ form.color }}</p>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Отмена</button>
            <button type="submit" class="submit-btn">
              {{ editingIndex === null ? 'Добавить' : 'Обновить' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="dataCount === 0" class="empty-state">
      <p>Данные для диаграммы отсутствуют. Добавьте их через форму выше.</p>
    </div>
  </div>
</template>

<style>
.pie-chart {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 50px 89px;
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

.data-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.add-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #45a049;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
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

.form-group label {
  font-weight: 500;
  color: #555;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn,
.submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.submit-btn {
  background-color: #4CAF50;
  color: white;
}

.submit-btn:hover {
  background-color: #45a049;
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