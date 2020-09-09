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
      render({ cache: false }).call({ root: 'root', ext: '.ext' }, 'filename', {}, jest.fn())
      expect(_clearCache).toHaveBeenCalled()
    })

    it('should not clear cache if cache option is true', () => {
      render({ cache: true }).call({ root: 'root', ext: '.ext' }, 'filename', {}, jest.fn())
      expect(_clearCache).not.toHaveBeenCalled()
    })

    it('should not clear cache if cache option is not specified', () => {
      render({}).call({ root: 'root', ext: '.ext' }, 'filename', {}, jest.fn())
      expect(_clearCache).not.toHaveBeenCalled()
    })
  })

  describe('component', () => {
    it('should create component', () => {
      render({}).call({ root: 'root', ext: '.ext' }, 'filename', {}, jest.fn())
      expect(createElementMock).toHaveBeenCalledWith('filename', {})
    })

    it('should send component to callback', () => {
      const callback = jest.fn()
      render({}).call({ root: 'root', ext: '.ext' }, 'filename', {}, callback)
      expect(callback).toHaveBeenCalledWith(null, 'filename')
    })

    it('should send error to callback', () => {
      createElementMock.mockImplementation(() => {
        throw new Error('500')
      })
      const callback = jest.fn()
      render({}).call({ root: 'root', ext: '.ext' }, 'filename', {}, callback)
      expect(callback).toHaveBeenCalledWith(new Error('500'))
    })
  })

  describe('layout', () => {
    it('should not create layout if layout option is not provided', () => {
      render({}).call({ root: 'root', ext: '.ext' }, 'filename', {}, jest.fn())
      expect(createElementMock).toHaveBeenCalledTimes(1)
      expect(renderMock).toHaveBeenCalledWith('filename')
    })

    it('should create layout using layout option', () => {
      render({ layout: 'Layout' }).call({ root: 'root', ext: '.ext' }, 'filename', {}, jest.fn())
      expect(createElementMock).toHaveBeenCalledWith('root/Layout.ext', {}, 'filename')
      expect(renderMock).toHaveBeenCalledWith('root/Layout.ext')
    })
  })
})
