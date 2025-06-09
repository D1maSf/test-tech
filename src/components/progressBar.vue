<script setup>
import { computed, ref, watch, onMounted } from 'vue';
const showText = ref(true);
const props = defineProps({
  value: { type: Number, default: 0, validator: (v) => v >= 0 && v <= 100 },
  status: { type: String, default: 'in-progress', validator: (v) => ['in-progress', 'success', 'warning', 'error'].includes(v) },
  size: { type: Number, default: 100 },
  backgroundColor: { type: String, default: 'rgba(128, 128, 128, 0.2)' },
  type: { type: String, default: 'default' },
});

const center = 50;
const radius = computed(() => center - 4);
const circumference = computed(() => 2 * Math.PI * radius.value);

const strokeDashArray = computed(() => circumference.value);
const backgroundOffset = computed(() => 0);

const animatedValue = ref(props.value);
const animationFrame = ref(null);
const animatedText = ref(props.status === 'in-progress' ? '0%' : '');
const statusIconOpacity = ref(0);

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = (angleDeg - 0) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (x, y, r, start, end) => {
  const startCoord = polarToCartesian(x, y, r, end);
  const endCoord = polarToCartesian(x, y, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${startCoord.x} ${startCoord.y} A ${r} ${r} 0 ${largeArc} 0 ${endCoord.x} ${endCoord.y}`;
};

const dashboardProgressArc = computed(() => {
  const progress = props.status === 'in-progress' ? animatedValue.value : 100;
  const end = 135 + 270 * (progress / 100);
  return describeArc(50, 50, radius.value, 135, end);
});

const dashboardBackgroundArc = computed(() => {
  return describeArc(50, 50, radius.value, 135, 405);
});

const currentDashOffset = computed(() => circumference.value * (1 - animatedValue.value / 100));

const startAnimation = (newValue) => {
  if (animationFrame.value) cancelAnimationFrame(animationFrame.value);
  const startValue = animatedValue.value;
  const change = newValue - startValue;
  const duration = 800;
  let startTime = null;

  const animate = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    animatedValue.value = startValue + change * easeInOutQuad(progress);
    updateText();
    if (progress < 1) animationFrame.value = requestAnimationFrame(animate);
    else animationFrame.value = null;
  };

  animationFrame.value = requestAnimationFrame(animate);
};

const updateText = () => {
  if (props.status === 'in-progress') animatedText.value = `${Math.round(animatedValue.value)}%`;
};

const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const currentColor = computed(() => {
  switch(props.status) {
    case 'success': return '#4CAF50';
    case 'warning': return '#FFC107';
    case 'error': return '#F44336';
    default:
      const p = animatedValue.value / 100;
      return p <= 0.5
          ? interpolateColor('#FF5252', '#FFEB3B', p * 2)
          : interpolateColor('#FFEB3B', '#4CAF50', (p - 0.5) * 2);
  }
});

const textColor = computed(() => props.status === 'in-progress' ? '#333' : 'transparent');

const animateStatusIcon = () => {
  let opacity = 0, duration = 300, startTime = null;
  const animate = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    statusIconOpacity.value = progress;
    if (progress < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

watch(() => props.value, (newVal) => {
  if (props.status === 'in-progress') startAnimation(newVal);
});

watch(() => props.status, (newStatus) => {
  if (newStatus === 'in-progress') {
    statusIconOpacity.value = 0;
    startAnimation(props.value);
  } else {
    animatedValue.value = 100;
    animateStatusIcon();
    animatedText.value = '';
  }
});

onMounted(() => {
  if (props.status !== 'in-progress') {
    animatedValue.value = 100;
    statusIconOpacity.value = 1;
  } else {
    startAnimation(props.value);
  }
});

function interpolateColor(color1, color2, factor) {
  if (factor <= 0) return color1;
  if (factor >= 1) return color2;
  const hex = (color) => /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)?.slice(1).map(x => parseInt(x, 16)) ?? [0,0,0];
  const r1 = hex(color1), r2 = hex(color2);
  const r3 = r1.map((c, i) => Math.round(c + factor * (r2[i] - c)));
  return `#${r3.map(c => `0${c.toString(16)}`.slice(-2)).join('')}`;
}
</script>

<template>
  <div class="circular-progress" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" viewBox="0 0 100 100">
      <!-- Фоновый круг или дуга -->
      <template v-if="type === 'dashboard'">
        <path
            class="progress-bg"
            :d="dashboardBackgroundArc"
            :stroke="backgroundColor"
            stroke-width="8"
            fill="transparent"
            stroke-linecap="butt"
        />
      </template>
      <template v-else>
        <circle
            class="progress-bg"
            :stroke="backgroundColor"
            stroke-width="8"
            fill="transparent"
            :r="radius"
            :cx="center"
            :cy="center"
            :stroke-dasharray="strokeDashArray"
            :stroke-dashoffset="backgroundOffset"
            stroke-linecap="butt"
        />
      </template>

      <!-- Прогресс -->
      <template v-if="type === 'dashboard'">
        <path
            class="progress-fill"
            :d="dashboardProgressArc"
            :stroke="currentColor"
            stroke-width="8"
            fill="transparent"
            stroke-linecap="butt"
        />
      </template>
      <template v-else>
        <circle
            class="progress-fill"
            :stroke="currentColor"
            stroke-width="8"
            fill="transparent"
            :r="radius"
            :cx="center"
            :cy="center"
            :stroke-dasharray="strokeDashArray"
            :stroke-dashoffset="currentDashOffset"
            stroke-linecap="butt"
        />
      </template>

      <!-- Иконки статусов -->
      <template v-if="status !== 'in-progress'">
        <path
            v-if="status === 'success'"
            class="status-icon"
            fill="none"
            stroke="green"
            stroke-width="6"
            stroke-linecap="round"
            d="M30,50 L45,65 L70,35"
            :style="{ opacity: statusIconOpacity }"
        />
        <path
            v-if="status === 'error'"
            class="status-icon"
            fill="none"
            stroke="red"
            stroke-width="6"
            stroke-linecap="round"
            d="M35,35 L65,65 M65,35 L35,65"
            :style="{ opacity: statusIconOpacity }"
        />
        <path
            v-if="status === 'warning'"
            class="status-icon"
            fill="none"
            stroke="orange"
            stroke-width="4"
            stroke-linecap="round"
            d="M50,30 L50,60 M50,65 L50,70"
            :style="{ opacity: statusIconOpacity }"
        />
      </template>

      <!-- Текст -->
      <text
          v-if="showText"
          class="progress-text"
          x="50"
          y="50"
          text-anchor="middle"
          dominant-baseline="middle"
          :fill="textColor"
      >
        {{ animatedText }}
      </text>
    </svg>
  </div>
</template>

<style scoped>
.circular-progress { transition: all 0.3s ease; }
.progress-bg { transition: stroke 0.5s ease; }
.progress-fill { transition: stroke 0.5s ease; }
.progress-text { font-size: 20px; font-weight: bold; transition: fill 0.3s ease; }
.status-icon { transition: opacity 0.5s ease-in-out; }
</style>
