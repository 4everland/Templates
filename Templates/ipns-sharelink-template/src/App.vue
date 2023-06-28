<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@media screen and (max-width: 768px) {
  #app {
    height: auto !important;
    overflow: auto !important;
  }
}
#app {
  width: 100vw;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
}
* {
  margin: 0;
  padding: 0;
}
</style>
