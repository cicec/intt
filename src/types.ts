export enum Bundler {
  WEBPACK = 'webpack',
  SNOWPACK = 'snowpack'
}

export enum MainLibrary {
  REACT = 'react',
  VUE = 'vue'
}

export type Answers = {
  name: string
  bundler: Bundler
  mainLibrary: MainLibrary
}
