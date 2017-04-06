<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
  	<q-ajax-bar ref="bar" position="bottom" size="8" color="primary"></q-ajax-bar>
    <router-view></router-view>
  </div>
</template>

<script>
/*
 * Root component
 */
export default {}
</script>

<style></style>
