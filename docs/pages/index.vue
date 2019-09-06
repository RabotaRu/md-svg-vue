<template>
  <div class="page">
    <h1>
      <a href="https://github.com/RabotaRu/md-svg-vue">@rabota/md-svg-vue</a>
    </h1>
    <div v-for="ns in allNs" :key="ns">
      <div>
        <h2>{{ ns }}</h2>
        <div class="section">
          <div
            v-for="icon in componentsByNs[ns]"
            :key="icon.ns + icon.name"
            class="container"
            @click="clickContainter(icon)"
          >
            <Icon :width="48" :height="48" :name="icon.ns + '/' + icon.name" />
            <span
              class="container__title"
            >{{ icon.name }}</span>
          </div>
        </div>
      </div>
    </div>
    <IconInfo class="icon_info" :text="infoText" />
  </div>
</template>

<script>
import Icon from '@/components/Icon.vue'
import IconInfo from '@/components/IconInfo.vue'
import allComponents from '~/components.json'

export default {
  components: {
    Icon,
    IconInfo
  },
  data () {
    return {
      allComponents,
      infoText: ''
    }
  },
  computed: {
    componentsByNs () {
      const res = {}
      allComponents.forEach((el) => {
        if (res[el.ns]) {
          res[el.ns].push(el)
        } else {
          res[el.ns] = [el]
        }
      })
      return res
    },
    allNs () {
      const keys = Object.keys(this.componentsByNs)
      keys.sort()
      return keys
    }
  },
  methods: {
    clickContainter (icon) {
      this.infoText = `import ${icon.name} from '@rabota/md-svg-vue/dist/${icon.ns + '/' + icon.name}.vue'`
    }
  }
}
</script>

<style scoped>
.page {
  text-align: center;
}
.section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.container {
  margin: 10px;
  width: 150px;
  text-align: center;
  overflow-wrap: break-word;
}

.container:hover {
  cursor: pointer;
  background-color: aqua;
}

.container__title {
  font-family: Arial, sans-serif;
  font-size: 14px;
}

.icon_info {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
