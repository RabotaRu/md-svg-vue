<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      default: null
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    }
  },
  data () {
    return {
      iconComp: null
    }
  },
  watch: {
    name: {
      async handler (val) {
        if (val) {
          try {
            // this approach only for demo. long generate all webpack chunks
            // use eager for one chunk
            const component = await import(
              /* webpackMode: "eager" */
              `@rabota/md-svg-vue/dist/${val}.vue`)
            this.iconComp = component.default
          } catch (err) {
            // eslint-disable-next-line
            console.error(err)
            this.iconComp = null
          }
        } else {
          this.iconComp = null
        }
      },
      immediate: true
    }
  }
}
</script>

<template>
  <div>
    <component
      :is="iconComp"
      v-if="iconComp"
      :width="width"
      :height="height"
    />
  </div>
</template>
