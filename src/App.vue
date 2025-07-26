<script setup>
import DataDisplay from './components/DataDisplay.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>Vue.js API Data Fetcher</h1>
      <p>A demo application that fetches data from external APIs</p>
    </header>
    <main>
      <DataDisplay />
    </main>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

header {
  text-align: center;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
}

header h1 {
  color: white;
  font-size: 2.5em;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2em;
  margin: 0;
}

main {
  padding: 0 20px 40px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
</style>
