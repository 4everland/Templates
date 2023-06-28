<template>
  <div id="app">
    <router-view />
    <div id="mintFooter" class="container">
      <a href="https://4everland.org" target="_blank" style="margin: 0 10px">
        Powered by 4EVERLAND</a
      >
      <span>|</span>
      <a
        href="https://dashboard.4everland.org"
        target="_blank"
        style="margin: 0 10px"
        >Try yourself</a
      >
    </div>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-image: url("@/assets/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 50px 0;
  box-sizing: border-box;
}
* {
  padding: 0;
  margin: 0;
}
html {
  background-color: #f9fbfc;
}
#mintFooter {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 14px;
  color: #6c7789;
  justify-content: center;
  a {
    font-size: 14px;
    color: #2a7eed;
    text-decoration: none;
  }
}

@media (max-width: 960px) {
  #mintFooter {
    position: unset;
  }
}
</style>
