import process from 'child_process'
import { stringify as jsStringify } from 'javascript-stringify'

export const keys = <K extends string>(obj: Record<K, any>) => Object.keys(obj) as K[]

export const foreach = <T, R, K extends string>(fn: (value: T, key: K) => R, obj: Record<K, T>) =>
  keys(obj).forEach(key => fn(obj[key], key))

export const map = <T, R, K extends string>(fn: (value: T, key: K) => R, obj: Record<K, T>) =>
  keys(obj).reduce((acc, key) => ({ ...acc, ...{ [key]: fn(obj[key], key) } }), {} as Record<K, R>)

export const execute = <R, T extends any[]>(fn: (...args: T) => R, ...args: T) => fn(...args)

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
