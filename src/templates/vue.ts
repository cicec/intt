import { has } from '../utils'
import { Answers } from '../types'

export const vueApp = ({ features }: Answers) => `<template>
  <div>
    <h1>
      {{ name }}
    </h1>
  </div>
</template>

<script${has.typescript(features) ? ` lang="ts"` : ''}>
export default {
  setup() {
    return { name: 'Hello World!' }
  }
}
</script$>
`

export const vueIndex = () => `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`

export const vueShims = () => `declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
`
