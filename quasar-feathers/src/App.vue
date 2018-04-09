<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="styl">
  @import '~variables'

  $link-color          ?= lighten($primary, 25%)
  $link-color-active   ?= $primary

  a
    color $link-color
    text-decoration none
    cursor pointer
    outline 0
    transition color .25s
    &:hover
      color $link-color-active
    &:active, &:hover
      outline-width 0

  .modal-header
    padding-bottom 20px

  .modal-body
    padding-bottom 20px

</style>
