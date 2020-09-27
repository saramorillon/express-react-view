export function _clearCache(root: string, ext: string): void {
  const moduleRegex = new RegExp(`^${root}.*${ext}$`)
  Object.keys(require.cache).forEach(function (key) {
    if (moduleRegex.test(require.cache[key]?.filename || '')) {
      delete require.cache[key]
    }
  })
}

export function _require(path: string): any {
  return require(path).default
}
