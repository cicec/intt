import process from 'child_process'
import { stringify as jsStringify } from 'javascript-stringify'
import { Answers, Bundler, Features, MainLibrary } from './types'

export const keys = <K extends string>(obj: Record<K, any>) => Object.keys(obj) as K[]

export const foreach = <T, R, K extends string>(fn: (value: T, key: K) => R, obj: Record<K, T>) =>
  keys(obj).forEach(key => fn(obj[key], key))

export const map = <T, R, K extends string>(fn: (value: T, key: K) => R, obj: Record<K, T>) =>
  keys(obj).reduce((acc, key) => ({ ...acc, ...{ [key]: fn(obj[key], key) } }), {} as Record<K, R>)

export const execute = <R, T extends any[]>(fn: (...args: T) => R, ...args: T) => fn(...args)

export const mergeDeepWith = <O1 extends { [x: string]: any }, O2 extends { [x: string]: any }>(
  fn: (k: string, val: any, newVal: any) => any,
  o1: O1,
  o2: O2
) => {
  const isObj = (x: unknown) => Object.prototype.toString.call(x) === '[object Object]'

  const result = { ...o1 }

  for (const key in o2) {
    const [v1, v2] = [o1[key], o2[key]]

    if (isObj(v1) && isObj(v2)) {
      result[key] = mergeDeepWith(fn, v1, v2)
    } else {
      result[key] = fn(key, v1, v2)
    }
  }

  return result
}

export const includesWith = <T>(fn: (a: T, b: T) => boolean, x: T, list: T[]) => {
  for (const item of list) {
    if (fn(x, item)) {
      return true
    }
  }

  return false
}

export const uniqWith = <T>(fn: (a: T, b: T) => boolean, list: T[]) => {
  const result: T[] = []

  for (const item of list) {
    if (!includesWith(fn, item, result)) {
      result.push(item)
    }
  }

  return result
}

export const uniqBy = <T>(fn: (item: T) => any, list: T[]) =>
  uniqWith((a, b) => fn(a) === fn(b), list)

export const uniq = <T>(list: T[]) => uniqBy(x => x, list)

export const command = (command: string) =>
  new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    process.exec(command, function (error, stdout, stderr) {
      if (error) {
        return reject(error)
      }

      resolve({ stdout, stderr })
    })
  })

export const stringify = {
  json: (value: any) => JSON.stringify(value, null, 2),
  js: (value: any) =>
    jsStringify(
      value,
      (value, _, stringify) => {
        if (typeof value === 'string' && value.startsWith('CODE:')) {
          return value.replace(/"/g, '\\"').replace(/^CODE:/, '')
        }

        return stringify(value)
      },
      2
    )
}

export const is: { [x: string]: (v: Answers) => boolean } = {
  webpack: ({ bundler }) => bundler === Bundler.WEBPACK,
  snowpack: ({ bundler }) => bundler === Bundler.SNOWPACK,
  react: ({ mainLibrary }) => mainLibrary === MainLibrary.REACT,
  vue: ({ mainLibrary }) => mainLibrary === MainLibrary.VUE,
  babel: ({ features }) => features.includes(Features.BABEL),
  typescript: ({ features }) => features.includes(Features.TYPESCRIPT)
}
