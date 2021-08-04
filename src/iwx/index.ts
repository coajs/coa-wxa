import { DataSet, Dic } from '../typing'

const w = wx

const clone = <T = any>(source: any) => {
  return JSON.parse(JSON.stringify(source)) as T
}

const showModel = (content: string) => {
  wx.showModal({ title: '错误', content, showCancel: false, success: () => showModel(content) })
}

const error = (message: string): never => {
  wx.hideLoading()
  showModel(message)
  throw new Error('DieError: ' + message)
}

const async = <T = any>(
  func: (...args: any[]) => any,
  args?: any,
  self?: WechatMiniprogram.Component.TrivialInstance | WechatMiniprogram.Page.TrivialInstance
) =>
  new Promise((resolve) =>
    func(
      {
        ...args,
        success: resolve,
        fail: () => resolve(undefined),
      },
      self
    )
  ) as Promise<T>

const async_void = (func: (...args: any[]) => any, args?: any) =>
  new Promise((resolve) =>
    func({
      ...args,
      success: () => resolve(true),
      fail: () => resolve(false),
    })
  ) as Promise<boolean>

const sync = <T = any>(func: (...args: any[]) => any, ...args: any[]) => {
  try {
    return func(...args) as T
  } catch (e) {
    return undefined
  }
}

export default new (class {
  showToast(title: string, option?: Dic<any>) {
    const opt = { mask: true, icon: 'none' } as WechatMiniprogram.ShowToastOption
    return w.showToast({ ...opt, ...option, title })
  }

  showModal(object: WechatMiniprogram.ShowModalOption) {
    return w.showModal(object)
  }

  showLoading(title = '正在加载中...', option = {}) {
    const opt = { mask: true }
    return w.showLoading({ title, ...opt, ...option })
  }

  showTabBar(object: WechatMiniprogram.ShowTabBarOption = {}) {
    return w.showTabBar(object)
  }

  hideTabBar(object: WechatMiniprogram.HideTabBarOption = {}) {
    return w.hideTabBar(object)
  }

  hideLoading() {
    return w.hideLoading()
  }

  hideKeyboard(object: WechatMiniprogram.HideKeyboardOption = {}) {
    return w.hideKeyboard(object)
  }

  pageScrollTo(object: WechatMiniprogram.PageScrollToOption) {
    return w.pageScrollTo(object)
  }

  canIUse(methodName: string) {
    return w.canIUse(methodName)
  }

  nextTick(callback: (...args: any[]) => any) {
    w.nextTick(callback)
  }

  getMenuButtonBoundingClientRect() {
    return w.getMenuButtonBoundingClientRect()
  }

  setNavigationBarTitle(title: string, object?: Dic<any>) {
    return w.setNavigationBarTitle({ title, ...object })
  }

  setNavigationBarColor(object: WechatMiniprogram.SetNavigationBarColorOption) {
    return w.setNavigationBarColor(object)
  }

  setBackgroundColor(object: WechatMiniprogram.SetBackgroundColorOption) {
    return w.setBackgroundColor(object)
  }

  saveImageToPhotosAlbum(args: WechatMiniprogram.SaveImageToPhotosAlbumOption) {
    return w.saveImageToPhotosAlbum(args)
  }

  navigateToMiniProgram(appId: string, object?: Dic<any>) {
    return w.navigateToMiniProgram({ appId, ...object })
  }

  switchTab(object: WechatMiniprogram.SwitchTabOption) {
    return w.switchTab(object)
  }

  redirectTo(object: WechatMiniprogram.RedirectToOption) {
    return w.redirectTo(object)
  }

  navigateTo(object: WechatMiniprogram.NavigateToOption) {
    return w.navigateTo(object)
  }

  navigateBack(object = { delta: 1 }) {
    return w.navigateBack(object)
  }

  navigateBackMiniProgram(object = {}) {
    return w.navigateBackMiniProgram(object)
  }

  reLaunch(object: WechatMiniprogram.ReLaunchOption) {
    return w.reLaunch(object)
  }

  createSelectorQuery() {
    return w.createSelectorQuery()
  }

  setClipboardData(object: WechatMiniprogram.SetClipboardDataOption) {
    return w.setClipboardData(object)
  }

  createAnimation(object: any) {
    return w.createAnimation(object)
  }

  previewImage(object: WechatMiniprogram.PreviewImageOption) {
    return w.previewImage(object)
  }

  makePhoneCall(object: WechatMiniprogram.MakePhoneCallOption) {
    return w.makePhoneCall(object)
  }

  getApp() {
    return getApp()
  }

  getCurrentPages() {
    return getCurrentPages()
  }

  getSystemInfoSync() {
    return sync(w.getSystemInfoSync)
  }

  getExtConfigSync() {
    return sync(w.getExtConfigSync)
  }

  getAccountInfoSync() {
    return sync<WechatMiniprogram.AccountInfo>(w.getAccountInfoSync)
  }

  getEnterOptionsSync() {
    return sync(w.getEnterOptionsSync)
  }

  getLaunchOptionsSync() {
    return sync(w.getLaunchOptionsSync)
  }

  getStorageInfoSync() {
    return sync(w.getStorageInfoSync)
  }

  setTabBarStyle(options: WechatMiniprogram.SetTabBarStyleOption) {
    return w.setTabBarStyle(options)
  }

  setTabBarItem(options: WechatMiniprogram.SetTabBarItemOption) {
    return w.setTabBarItem(options)
  }

  async canvasToTempFilePath(
    object: WechatMiniprogram.CanvasToTempFilePathOption,
    self: WechatMiniprogram.Component.TrivialInstance | WechatMiniprogram.Page.TrivialInstance
  ) {
    return await async(w.canvasToTempFilePath, object, self)
  }

  async openDocument(args: WechatMiniprogram.OpenDocumentOption) {
    return await async_void(w.openDocument, args)
  }

  async getSystemInfo() {
    return await async(w.getSystemInfo)
  }

  async checkSystemInfo() {
    return (await this.getSystemInfo()) || error('系统信息获取失败')
  }

  async requestPayment(arg: WechatMiniprogram.RequestPaymentOption) {
    return await async(w.requestPayment, arg)
  }

  async setStorage(arg: WechatMiniprogram.SetStorageOption) {
    return await async(w.setStorage, arg)
  }

  async getStorage(arg: WechatMiniprogram.GetStorageOption) {
    return await async(w.getStorage, arg)
  }

  async removeStorage(arg: WechatMiniprogram.RemoveStorageOption) {
    return await async(w.removeStorage, arg)
  }

  async clearStorage(arg: WechatMiniprogram.ClearStorageOption) {
    return await async(w.clearStorage, arg)
  }

  setStorageSync(...args: any[]) {
    return sync<void>(w.setStorageSync, ...args)
  }

  getStorageSync(...args: any[]) {
    return sync(w.getStorageSync, ...args)
  }

  removeStorageSync(...args: any[]) {
    return sync<void>(w.removeStorageSync, ...args)
  }

  clearStorageSync() {
    return sync<void>(w.clearStorageSync)
  }

  async request(arg: WechatMiniprogram.RequestOption) {
    return await async<WechatMiniprogram.RequestSuccessCallbackResult>(w.request, arg)
  }

  async login(arg?: WechatMiniprogram.LoginOption) {
    return await async<WechatMiniprogram.LoginSuccessCallbackResult>(w.login, arg)
  }

  async wxCheckSession() {
    return await async<WechatMiniprogram.GeneralCallbackResult>(w.checkSession)
  }

  async checkLoginCode(arg?: WechatMiniprogram.LoginOption) {
    const res = await this.login(arg)
    return res.code || error('微信登陆失败，无法获取code')
  }

  async getImageInfo(args: WechatMiniprogram.GetImageInfoOption) {
    return await async(w.getImageInfo, args)
  }

  async chooseImage(args: WechatMiniprogram.ChooseImageOption) {
    return await async(w.chooseImage, args)
  }

  async uploadFile(args: WechatMiniprogram.UploadFileOption) {
    return await async<WechatMiniprogram.UploadFileSuccessCallbackResult>(w.uploadFile, args)
  }

  async downloadFile(args: WechatMiniprogram.DownloadFileOption) {
    return await async(w.downloadFile, args)
  }

  async getImageInfos(images: Dic<any>[]) {
    const imageArr = clone<Dic<any>[]>(images)

    const tempFiles = await Promise.all(imageArr.map((v) => this.getImageInfo({ src: v.url })))

    tempFiles.forEach((v, i) => (imageArr[i].url = v ? (v as DataSet).path : ''))

    return imageArr.filter((v) => v.url)
  }

  async chooseAddress(args: WechatMiniprogram.ChooseAddressOption = {}) {
    return await async(w.chooseAddress, args)
  }

  async getSetting(args: WechatMiniprogram.GetSettingOption) {
    return await async(w.getSetting, args)
  }

  async openSetting(args?: WechatMiniprogram.OpenSettingOption) {
    return await async(w.openSetting, args)
  }

  async authorize(args: WechatMiniprogram.AuthorizeOption) {
    return await async_void(w.authorize, args)
  }

  async showModalAsync(object: WechatMiniprogram.ShowModalOption) {
    return await async(w.showModal, object)
  }

  async getLocation(object: WechatMiniprogram.GetLocationOption) {
    return await async(w.getLocation, object)
  }

  async scanCode(object: WechatMiniprogram.ScanCodeOption = {}) {
    return await async(w.scanCode, object)
  }

  async setClipboardDataAsyncVoid(object: WechatMiniprogram.SetClipboardDataOption) {
    return await async_void(w.setClipboardData, object)
  }

  async saveImageToPhotosAlbumAsync(args: WechatMiniprogram.SaveImageToPhotosAlbumOption) {
    return await async(w.saveImageToPhotosAlbum, args)
  }

  async saveFile(args: WechatMiniprogram.WxSaveFileOption) {
    return await async(w.saveFile, args)
  }

  async getSavedFileInfo(args: WechatMiniprogram.GetSavedFileInfoOption) {
    return await async(w.getSavedFileInfo, args)
  }

  async getFileInfo(args: WechatMiniprogram.WxGetFileInfoOption) {
    return await async(w.getFileInfo, args)
  }

  self() {
    return w
  }
})()
