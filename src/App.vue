<template>
  <div class="wrapper">
    <!-- header -->
    <header>
      <div class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="log">Github Finder</div>
          </div>
        </div>
      </div>
    </header>
    <!-- router-view -->
    <router-view></router-view>
    <!-- footer -->

  </div>

</template>

<script>
export default {
  data () {
    return {
      links: [
        { title: 'Home', url: '/' }
      ]
    }
  }
}
</script>

<style lang="scss">
.navbar-link {
  &.router-link-exact-active {
    color: #645cd1;
  }
}
</style>