import pluginTransform from '@babel/plugin-transform-runtime'
import presetEnv from '@babel/preset-env'
import presetReact from '@babel/preset-react'
import { join } from 'path'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { _clearCache, _require } from './require'

require('@babel/register')({
  presets: [presetReact, presetEnv],
  plugins: [pluginTransform],
})

interface IExpressReactOptions {
  root: string
  ext?: string
  cache?: boolean
  layout?: string
}

export = function render(options: IExpressReactOptions) {
  return function (
    filename: string,
    props: Record<string, unknown>,
    callback: (e: any, rendered?: string) => void
  ): void {
    const { root, cache = true, layout } = options
    if (!cache) {
      _clearCache()
    }
    try {
      const ext = (options.ext || 'jsx').replace(/^\./, '')
      let path = join(root, `${filename}.${ext}`)
      let component = React.createElement(_require(path), props)
      if (layout) {
        path = join(root, `${layout}.${ext}`)
        component = React.createElement(_require(path), props, component)
      }
      callback(null, ReactDOMServer.renderToStaticMarkup(component))
    } catch (error) {
      callback(error)
    }
  }
}
