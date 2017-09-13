<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <q-ajax-bar ref="bar" position="bottom" size="8" color="primary"></q-ajax-bar>
    <router-view />
  </div>
</template>

<script>
  import {
    QAjaxBar
  } from 'quasar'

export default {
  components: {
    QAjaxBar
  }
}
</script>

<style></style>
