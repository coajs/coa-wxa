import config from '../config'
import { Dic } from '../typing'

// 内存
let $MEMORY = {} as Dic<string>

const snakeCase = (str: string) => (str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || []).map((x) => x.toLowerCase()).join('_')

const id2key = (id: string) => config.env + '_' + snakeCase(id)

export default new (class {
  local = new (class {
    set(id: string, value: any, ms = 30 * 24 * 3600 * 1000) {
      wx.setStorageSync(id2key(id), [Date.now() + ms, value])
    }

    get<T = any>(id: string) {
      const result = wx.getStorageSync(id2key(id)) || [0, undefined]

      const expire = result[0] || 0

      // 过期后删除
      if (expire < 1 || expire < Date.now()) {
        this.remove(id)
        return undefined
      }

      return result[1] as T
    }

    remove(id: string) {
      return wx.removeStorageSync(id2key(id))
    }

    clear() {
      wx.clearStorageSync()
    }

    async warp<T>(id: string, worker: () => Promise<T>, ms?: number) {
      let result = this.get(id)

      if (result === undefined) {
        result = await worker()
        this.set(id, result, ms)
      }
      return result
    }
  })()

  memory = new (class {
    set(id: string, value: any, ms = 24 * 3600 * 1000) {
      const expire = Date.now() + ms
      $MEMORY[id2key(id)] = JSON.stringify([expire, value])
      return value
    }

    get<T = any>(id: string) {
      try {
        const data = JSON.parse($MEMORY[id2key(id)] || '[0]')
        const expire = parseInt(data[0]) || 0
        if (expire < 1 || expire < Date.now()) {
          this.remove(id)
          return undefined
        }
        return data[1] as T
      } catch (e) {
        return undefined
      }
    }

    remove(id: string) {
      delete $MEMORY[id2key(id)]
    }

    clear() {
      $MEMORY = {}
    }

    show() {
      console.log('$SESSION', $MEMORY)
    }

    async warp<T>(id: string, worker: () => Promise<T>, ms?: number) {
      let result = this.get(id)

      if (result === undefined) {
        result = await worker()
        this.set(id, result, ms)
      }
      return result
    }
  })()
})()
