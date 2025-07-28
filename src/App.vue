<script setup>
// Router view will handle component rendering
</script>

<template>
  <div id="app">
    <header>
      <h1>🌟 Star Wars Database 🌟</h1>
      <p>Explore the galaxy far, far away with the Star Wars API</p>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  background-attachment: fixed;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: linear-gradient(135deg, #000428 0%, #004e92 100%);
  background-attachment: fixed;
}

header {
  text-align: center;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
  border-bottom: 2px solid #FFE81F;
}

header h1 {
  color: #FFE81F;
  font-size: 3em;
  margin: 0 0 10px 0;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
  font-weight: bold;
  letter-spacing: 2px;
}

header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3em;
  margin: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

main {
  padding: 0 20px 40px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #000;
}

/* Star field animation */
#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #eee, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #fff, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 20s linear infinite;
  z-index: -1;
  opacity: 0.6;
}

@keyframes sparkle {
  from { transform: translateX(0); }
  to { transform: translateX(-200px); }
}
</style>
