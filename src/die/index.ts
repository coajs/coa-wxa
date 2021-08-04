function showModel(content: string) {
  wx.showModal({ title: '错误', content, showCancel: false, success: () => showModel(content) })
}

function showModelOnce(content: string) {
  wx.showModal({ title: '提示', content, showCancel: false })
}

export default new (class {
  error(message: string): never {
    wx.hideLoading()
    showModel(message)
    throw new Error('DieError: ' + message)
  }

  hint(message: string): never {
    wx.hideLoading()
    showModelOnce(message)
    throw new Error('DieHintError: ' + message)
  }
})()
