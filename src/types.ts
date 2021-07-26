export enum Bundler {
  WEBPACK = 'webpack',
  SNOWPACK = 'snowpack'
}

export enum MainLibrary {
  REACT = 'react',
  VUE = 'vue'
}

export enum Features {
  BABEL = 'babel',
  TYPESCRIPT = 'typescript'
}

export type Answers = {
  name: string
  bundler: Bundler
  mainLibrary: MainLibrary
  features: Features[]
}

export type Files = { [x: string]: string | Files | undefined }

export type PackageConfig = {
  scripts?: { [x: string]: string }
  dependencies?: string[]
  devDependencies?: string[]
}

export type WebpackConfig = {
  prefix?: string[]
  entry?: string
  extensions?: string[]
  rules?: any[]
  plugins?: string[]
}

export type JSONConfig = { [x: string]: any }

export type SnowpackConfig = JSONConfig

export type BabelConfig = JSONConfig

export type PluginConfig = {
  condition?: boolean
  files?: Files
  package?: PackageConfig
  webpack?: WebpackConfig
  snowpack?: SnowpackConfig
  babel?: BabelConfig
}

export type Plugin = (answers: Answers) => PluginConfig
