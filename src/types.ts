export enum Bundler {
  WEBPACK = 'webpack',
  SNOWPACK = 'snowpack'
}

export enum Framework {
  REACT = 'react',
  VUE = 'vue'
}

export enum Feature {
  BABEL = 'babel',
  TYPESCRIPT = 'typescript'
}

export enum Test {
  NONE = 'none',
  JEST = 'jest',
  AVA = 'ava'
}

export type Answers = {
  name: string
  bundler?: Bundler
  framework?: Framework
  features?: Feature[]
  test?: Test
}

export type Selection =
  | 'webpack'
  | 'snowpack'
  | 'react'
  | 'vue'
  | 'babel'
  | 'typescript'
  | 'jest'
  | 'ava'

export type CLIOptions = {
  name: string
  is: Record<Selection, boolean>
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

export type Plugin = (options: CLIOptions) => PluginConfig
