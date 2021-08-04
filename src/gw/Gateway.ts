import { Dic, iwx, storage, time } from '..'

export namespace Gateway {
  export type Error = { code: string; message: string; retry?: boolean }
  export type Result<T> = { error?: Gateway.Error } & T
  export type Option = { [key: string]: boolean | undefined }
  export type Param = Dic<any>
  export type Header = Dic<string>
  export type Methods = 'options' | 'get' | 'head' | 'post' | 'put' | 'delete' | 'trace' | 'connect'
  export type MethodsUpper = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
}

// 基础工具
export class Gateway {
  protected host: string

  constructor(host: string) {
    this.host = host
  }

  async request<T = { [key: string]: any }>(
    method: Gateway.Methods,
    url: string,
    param: Gateway.Param = {},
    option: Gateway.Option = {},
    header: Gateway.Header = {}
  ) {
    let result = { error: { retry: true } } as Gateway.Result<T>,
      retryTimes = 0

    while (result.error?.retry && retryTimes < 2) {
      retryTimes++
      result = await this.handleRequest<T>(method, url, param, option, header)
    }

    return result
  }

  // 处理错误
  protected handleError(error: Gateway.Error, option: Gateway.Option): void {}

  // 处理loading
  protected handleLoading(process: string, option: Gateway.Option): void {}

  // 处理头部数据
  protected handleHeader(header: Gateway.Header, option: Gateway.Option): void {}

  // 处理请求数据
  private async handleRequest<T = { [key: string]: any }>(
    method: Gateway.Methods,
    url: string,
    param: Gateway.Param = {},
    option: Gateway.Option = {},
    header: Gateway.Header = {}
  ) {
    this.handleHeader(header, option)
    this.handleLoading('start', option)

    const requestConfig = {
      header,
      data: param,
      url: this.host + url,
      method: method.toUpperCase() as Gateway.MethodsUpper,
      timeout: 15e3,
    }
    const raw = (await iwx.request(requestConfig)) || {
      statusCode: -1,
      data: {
        error: { code: 'Gateway.NetworkError', message: '网络异常' },
      },
    }
    const result = this.handleResponseResult<T>(raw, option)

    this.handleLoading('end', option)

    return result
  }

  // 处理响应数据
  private handleResponseResult<T>({ data, statusCode }: any, option: Gateway.Option) {
    if (statusCode !== 200) {
      // 网络异常
      if (statusCode === -1) {
        this.handleError(data.error, option)
      }

      return {
        error: {
          code: 'Gateway.RequestError',
          message: '服务器请求异常',
          retry: true,
        },
      } as Gateway.Result<T>
    }

    // 服务端往客户端存储的数据
    if (data.storage) handleStorage(data.storage)

    // 处理非正常响应状态
    if (data.error) this.handleError(data.error, option)

    // 返回完整数据
    return data as Gateway.Result<T>
  }
}

function handleStorage({ local = {} as any, session = {} as any }) {
  local &&
    Object.keys(local).forEach((item) => {
      const { action, data = {}, ms = 0 } = local[item] || {}
      if (action === 'set') storage.local.set(item, data, ms < 1 ? time.forever : ms)
      else if (action === 'remove') storage.local.remove(item)
      else if (action === 'clear') storage.local.clear()
    })

  session &&
    Object.keys(session).forEach((item) => {
      const { action, data = {}, ms = 0 } = session[item] || {}
      if (action === 'set') storage.memory.set(item, data, ms < 1 ? time.forever : ms)
      else if (action === 'remove') storage.memory.remove(item)
      else if (action === 'clear') storage.memory.clear()
    })
}
