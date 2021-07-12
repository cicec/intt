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
