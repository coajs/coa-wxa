export default new (class {
  _close: boolean = false

  log(message: any, ...args: any[]) {
    this._close || console.log(message, ...args)
  }

  info(message: any, ...args: any[]) {
    this._close || console.info(message, ...args)
  }

  warn(message: any, ...args: any[]) {
    this._close || console.warn(message, ...args)
  }

  close() {
    this.log('关闭日志')
    this._close = true
  }

  open() {
    this._close = false
    this.log('打开日志')
  }
})()
