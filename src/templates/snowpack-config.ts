import { stringify } from '../utils'
import { Answers, MainLibrary } from '../types'

export default ({ mainLibrary }: Answers) => {
  const plugins = () => {
    if (mainLibrary === MainLibrary.VUE) {
      return ['@snowpack/plugin-vue']
    }

    return []
  }

  return stringify.json({
    mount: {
      dist: '/',
      src: '/'
    },
    plugins: plugins()
  })
}
