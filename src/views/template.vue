<template>
  <div class="app-container">
    Hello {{ message }}
  </div>
</template>

<script>
export default {
  name: 'todo',
  data() {
    return {
      message: 'world'
    }
  },
  computed: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
