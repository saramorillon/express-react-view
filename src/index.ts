import pluginTransform from '@babel/plugin-transform-runtime'
import presetEnv from '@babel/preset-env'
import presetReact from '@babel/preset-react'
import { join, parse } from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { _clearCache, _require } from './require'

require('@babel/register')({
  presets: [presetReact, presetEnv],
  plugins: [pluginTransform],
})

interface IExpressReactOptions {
  cache?: boolean
  layout?: string
}

export = function render(options?: IExpressReactOptions) {
  return function (
    filename: string,
    props: Record<string, unknown>,
    callback: (e: any, rendered?: string) => void
  ): void {
    const { cache = true, layout } = options || {}
    if (!cache) {
      _clearCache()
    }
    try {
      let component = React.createElement(_require(filename), props)
      if (layout) {
        const { dir, ext } = parse(filename)
        const layoutPath = join(dir, `${layout}${ext}`)
        component = React.createElement(_require(layoutPath), props, component)
      }
      callback(null, ReactDOMServer.renderToStaticMarkup(component))
    } catch (error) {
      callback(error)
    }
  }
}
