import { opt } from '../index'

export default new class {
  go (path: string, isRedirect = false) {
    if (!path || !path.trim())
      return

    path = path.trim()

    //以wx appId开头
    if (path.startsWith('wx')) {

      const colonIndex = path.indexOf(':')
      const appId = path.substr(0, colonIndex)
      const realPath = path.substr(colonIndex + 1)

      // 本小程序页面
      if (appId === opt.selfAppId)
        return this.goInner(realPath, isRedirect)

      //打开其它小程序
      return wx.navigateToMiniProgram({ appId, path: realPath && realPath.startsWith('/') ? realPath.substr(1) : realPath })
    }

    //以'/'或者'./'开头则为内部链接
    if (path.startsWith('/') || path.startsWith('./'))
      return this.goInner(path, isRedirect)

    //以http://或者https:// 则为外部h5链接
    if (path.startsWith('http://') || path.startsWith('https://'))
      return this.goInner(`/web/pages/link?link=${encodeURIComponent(path)}`, isRedirect)

    // 不是以上情况则警告
    console.warn('please provide correct path')
  }

  back (delta = 1, options = {}) {

    const opts = { delta, ...options }

    wx.navigateBack(opts)
  }

  reopen (path: string, args: WechatMiniprogram.ReLaunchOption) {
    wx.reLaunch({ url: path, ...args, fail: () => console.warn('try to reopen page fail') })
  }

  getPreviousFullPath () {

    const page = getCurrentPages().pop() || { route: '', options: {} }
    const route = page.route || ''
    const options = page.options || {}

    let querySting = '?'

    for (const key in options) {

      if (!options.hasOwnProperty(key))
        continue

      querySting += `${key}=${options[key]}&`
    }

    return '/' + (route + querySting).replace(/\?$/g, '').replace(/&$/g, '')

  }

  getPreviousPage () {
    const pages = getCurrentPages()
    pages.pop()
    return pages.pop()
  }

  private goInner (path: string, isRedirect = false) {

    //重定向 关闭当前页面
    if (isRedirect) return wx.redirectTo({ url: path, fail: e => wx.switchTab({ url: path, fail: e => console.warn('please provide correct inner path') }) })

    //压栈跳转
    return wx.navigateTo({ url: path, fail: e => wx.switchTab({ url: path, fail: e => console.warn('please provide correct inner path') }) })
  }

}