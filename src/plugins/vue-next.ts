import { dedent } from 'ts-dedent'
import { Plugin } from '../types'
import { execute } from '../utils'

const vueApp = (isTypescript: boolean) => dedent`
  <template>
    <div>
      <h1>{{ name }}</h1>
    </div>
  </template>

  <script${isTypescript ? ' lang="ts"' : ''}>
  export default {
    setup() {
      return { name: 'Hello World!' }
    }
  }
  </script>
`

const vueIndex = () => dedent`
  import { createApp } from 'vue'
  import App from './App.vue'

  createApp(App).mount('#app')
`

const vueShims = () => dedent`
  declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }
`

const vue: Plugin = ({ is }) => {
  const src = execute(() => {
    if (is.typescript) {
      return { 'App.vue': vueApp(true), 'index.ts': vueIndex(), 'shims-vue.d.ts': vueShims() }
    }

    return { 'App.vue': vueApp(false), 'index.js': vueIndex() }
  })

  const devDependencies = execute(() => {
    if (is.webpack) {
      return ['@vue/compiler-sfc', 'vue-loader@next']
    }

    if (is.snowpack) {
      return ['@snowpack/plugin-vue']
    }

    return []
  })

  const rules = execute(() => {
    const rules: any[] = [{ test: /\.vue$/, loader: 'vue-loader', exclude: /node_modules/ }]

    if (is.typescript) {
      rules.push({
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] },
        exclude: /node_modules/
      })
    }

    return rules
  })

  return {
    condition: is.vue,
    files: {
      src
    },
    package: {
      dependencies: ['vue@next'],
      devDependencies
    },
    webpack: {
      prefix: [`const { VueLoaderPlugin } = require('vue-loader')`],
      entry: './src/index.' + (is.typescript ? 'ts' : 'js'),
      extensions: ['.vue', '.ts'],
      rules,
      plugins: ['CODE:new VueLoaderPlugin()']
    },
    snowpack: {
      plugins: ['@snowpack/plugin-vue']
    }
  }
}

export default vue
