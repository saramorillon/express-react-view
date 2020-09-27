export function _clearCache(filename: string): void {
  Object.keys(require.cache).forEach(function (key) {
    if (require.cache[key]?.filename?.endsWith(filename)) {
      delete require.cache[key]
    }
  })
}

export function _require(path: string): any {
  return require(path).default
}
