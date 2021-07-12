import { stringify } from '../utils'
import { Answers, MainLibrary } from '../types'

export const html = ({
  name = 'app',
  bundleFilename = 'bundle.js',
  isModule = false
} = {}) => `<!DOCTYPE html>
<html>
  <head>
    <title>${name}</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="app"></div>
    <script ${isModule ? ` type="module"` : ``}  src="${bundleFilename}"></script>
  </body>
</html>
`

export const babelrc = ({ mainLibrary }: Answers) => {
  const config: Record<string, any> = {
    presets: [['@babel/preset-env', { modules: false }]]
  }

  if (mainLibrary === MainLibrary.REACT) {
    config.presets.push('@babel/preset-react')
  }

  return stringify.json(config)
}

export const gitignore = () => `
.cache/
coverage/
dist/*
!dist/index.html
node_modules/
*.log

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`
