import React from 'react'
import ReactDOMServer from 'react-dom/server'
import render from '.'
import { _clearCache, _require } from './require'

jest.mock('react')
jest.mock('react-dom/server')
jest.mock('./require')

const createElementMock = React.createElement as jest.Mock
const renderMock = ReactDOMServer.renderToStaticMarkup as jest.Mock
const _requireMock = _require as jest.Mock

describe('render', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    _requireMock.mockImplementation((p) => p)
    createElementMock.mockImplementation((p: string) => p)
    renderMock.mockImplementation((p: string) => p)
  })

  describe('cache', () => {
    it('should clear cache if cache option is false', () => {
      render({ root: 'root', cache: false })('filename', {}, jest.fn())
      expect(_clearCache).toHaveBeenCalled()
    })

    it('should not clear cache if cache option is true', () => {
      render({ root: 'root', cache: true })('filename', {}, jest.fn())
      expect(_clearCache).not.toHaveBeenCalled()
    })

    it('should not clear cache if cache option is not specified', () => {
      render({ root: 'root' })('filename', {}, jest.fn())
      expect(_clearCache).not.toHaveBeenCalled()
    })
  })

  describe('extension', () => {
    it('should use jsx as default extension', () => {
      render({ root: 'root' })('filename', {}, jest.fn())
      expect(_require).toHaveBeenCalledWith('root/filename.jsx')
    })

    it('should use provided extension', () => {
      render({ root: 'root', ext: 'tsx' })('filename', {}, jest.fn())
      expect(_require).toHaveBeenCalledWith('root/filename.tsx')
    })

    it('should use provided extension without starting dot', () => {
      render({ root: 'root', ext: '.tsx' })('filename', {}, jest.fn())
      expect(_require).toHaveBeenCalledWith('root/filename.tsx')
    })
  })

  describe('component', () => {
    it('should create component', () => {
      render({ root: 'root' })('filename', {}, jest.fn())
      expect(createElementMock).toHaveBeenCalledWith('root/filename.jsx', {})
    })

    it('should send component to callback', () => {
      const callback = jest.fn()
      render({ root: 'root' })('filename', {}, callback)
      expect(callback).toHaveBeenCalledWith(null, 'root/filename.jsx')
    })

    it('should send error to callback', () => {
      createElementMock.mockImplementation(() => {
        throw new Error('500')
      })
      const callback = jest.fn()
      render({ root: 'root', layout: 'Layout' })('filename', {}, callback)
      expect(callback).toHaveBeenCalledWith(new Error('500'))
    })
  })

  describe('layout', () => {
    it('should not create layout if layout option is not provided', () => {
      render({ root: 'root' })('filename', {}, jest.fn())
      expect(createElementMock).toHaveBeenCalledTimes(1)
      expect(renderMock).toHaveBeenCalledWith('root/filename.jsx')
    })

    it('should create layout using layout option', () => {
      render({ root: 'root', layout: 'Layout' })('filename', {}, jest.fn())
      expect(createElementMock).toHaveBeenCalledWith('root/Layout.jsx', {}, 'root/filename.jsx')
      expect(renderMock).toHaveBeenCalledWith('root/Layout.jsx')
    })
  })
})
