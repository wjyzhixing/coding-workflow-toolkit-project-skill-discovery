<script setup lang="ts">
import { shallowRef } from 'vue'
import './App.css'

const count = shallowRef(0)

function incrementCount() {
  count.value += 1
}
</script>

<template>
  <main class="demo-page">
    <section class="demo-card" aria-labelledby="demo-title">
      <p class="eyebrow">Vite + Vue 3 + TypeScript</p>
      <h1 id="demo-title">Vue Demo</h1>
      <p class="description">这是一个可直接扩展的基础 Vue 工程。</p>
      <button class="count-button" type="button" @click="incrementCount">Count is {{ count }}</button>
    </section>
  </main>
</template>
