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

export = function render<T = never>(options?: IExpressReactOptions) {
  return function (
    this: { root: string; ext: string },
    filename: string,
    props: T,
    callback: (e: any, rendered?: string) => void
  ): void {
    const { cache = true, layout } = options || {}
    if (!cache) {
      _clearCache(this.root, this.ext)
    }
    try {
      let component = React.createElement(_require(filename), props)
      if (layout) {
        const layoutPath = join(this.root, `${layout}${this.ext}`)
        component = React.createElement(_require(layoutPath), props, component)
      }
      callback(null, ReactDOMServer.renderToStaticMarkup(component))
    } catch (error) {
      callback(error)
    }
  }
}
