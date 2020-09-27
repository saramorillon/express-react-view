import presetEnv from '@babel/preset-env'
import presetReact from '@babel/preset-react'
import { join } from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { _clearCache, _require } from './require'

require('@babel/register')({ presets: [presetReact, presetEnv] })

interface IExpressReactOptions {
  cache?: boolean
  layout?: string
}

function createComponent(path: string, props: Record<string, unknown>, cache: boolean, ...children: React.ReactNode[]) {
  if (!cache) {
    _clearCache(path)
  }
  return React.createElement(_require(path), props, children)
}

export = function render(options?: IExpressReactOptions) {
  return function (
    this: { root: string; ext: string },
    filename: string,
    props: Record<string, unknown>,
    callback: (e: any, rendered?: string) => void
  ): void {
    const { cache = true, layout } = options || {}
    try {
      let component = createComponent(filename, props, cache)
      if (layout) {
        const layoutPath = join(this.root, `${layout}${this.ext}`)
        component = createComponent(layoutPath, props, cache, component)
      }
      callback(null, ReactDOMServer.renderToStaticMarkup(component))
    } catch (error) {
      callback(error)
    }
  }
}
