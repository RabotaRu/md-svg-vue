<template>
  <div>
    <input
      type="text"
      readonly
      :value="text"
      :style="{ width: text.length + 'ch' }"
    >
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
