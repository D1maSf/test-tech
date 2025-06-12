<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const store = useStore();
const chartCanvas = ref(null);
const chartInstance = ref(null);
const editingIndex = ref(null);

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
    const data = { ...pieData.value };
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

  const { labels, datasets } = pieData.value;

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

const handleSubmit = () => {
  const newValue = Number(form.value.value);
  const currentData = [...pieData.value.datasets[0].data];
  const total = currentData.reduce((a, b) => a + b, 0);

  if (editingIndex.value === null) {
    if (total + newValue > 100) {
      alert('Сумма значений не может превышать 100%');
      return;
    }
    store.dispatch('addData', { ...form.value });
  } else {
    const oldValue = currentData[editingIndex.value];
    if (total - oldValue + newValue > 100) {
      alert('Сумма значений не может превышать 100%');
      return;
    }
    store.dispatch('updateData', {
      index: editingIndex.value,
      data: { ...form.value }
    });
    editingIndex.value = null;
  }

  resetForm();
};

const editItem = (index) => {
  const dataset = pieData.value.datasets[0];
  if (!dataset) {
    console.log('[editItem] Dataset undefined for index:', index);
    return;
  }

  form.value.label = pieData.value.labels[index];
  form.value.value = dataset.data[index];
  form.value.color = dataset.backgroundColor[index];
  editingIndex.value = index;

  console.log('[editItem] Editing index:', index, 'form:', { ...form.value });
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

const resetForm = () => {
  console.log('[resetForm] Resetting form');
  form.value.label = '';
  form.value.value = 1;
  form.value.color = '#3e95cd';
};
</script>

<template>
  <div class="pie-chart">


    <div class="chart-container">
      <div class="chart-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <div class="form-container">
        <h2 class="form-title">Добавить данные</h2>
        <form @submit.prevent="handleSubmit" class="data-form">
          <div class="form-group">
            <label for="label">Наименование</label>
            <input
                id="label"
                v-model="form.label"
                type="text"
                required
                class="form-input"
                placeholder="Введите название"
            />
          </div>

          <div class="form-group">
            <label for="value">Значение</label>
            <input
                id="value"
                v-model.number="form.value"
                type="number"
                required
                min="1"
                class="form-input"
                placeholder="Введите значение"
            />
          </div>

          <div class="form-group">
            <label for="color">Цвет</label>
            <ColorPicker
                v-model:pureColor="form.color"
                format="hex"
                pickerType="chrome"
                :disableHistory="true"
                :disableAlpha="true"
            />
            <p>Выбранный цвет: {{ form.color }}</p>
          </div>

          <button type="submit" class="submit-btn">
            {{ editingIndex === null ? 'Добавить' : 'Обновить' }}
          </button>
          <button
              v-if="editingIndex !== null"
              type="button"
              @click="cancelEdit"
              class="cancel-btn"
          >
            Отмена
          </button>
        </form>
      </div>
    </div>

    <div v-if="dataCount > 0" class="data-list">
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

    <div v-else class="empty-state">
      <p>Данные для диаграммы отсутствуют. Добавьте их через форму выше.</p>
    </div>
  </div>


</template>

<style>
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