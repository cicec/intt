export const vueApp = () => `<template>
<div>
  <h1>
    {{ name }}
  </h1>
</div>
</template>

<script lang="ts">
export default {
  setup() {
    return { name: 'Hello World!' }
  }
}
</script>
`

export const vueIndex = () => `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`
