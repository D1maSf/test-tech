<script setup>

</script>

<template>
  <section class="hero">
    <div class="container">
  <div class="hero-content">
    <h1 class="hero-title">Заголовок главного блока</h1>
    <p class="hero-description">Описание или дополнительный текст, который мотивирует пользователя к действию.</p>
    <div class="hero-footer">
          <router-link
        to="/progressBarDemo"
        class="btn btn--default"
    >
      Progress Bar
    </router-link>
    <router-link
        to="/pieChart"
        class="btn btn--default"
    >
      Pie Chart
    </router-link>
    </div>
  </div>
    </div>

</section>
</template>

<style>

</style>