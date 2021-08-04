import { Dic } from '../typing'

export default new (class {
  async init(page: any, id: string, data: Dic<any> = {}, resume = true) {
    const component = page.selectComponent ? page.selectComponent(`#${id}`) : ''

    if (!component) {
      console.warn(`please provide correct id: ${id}`)
      return undefined
    }

    return (await new Promise((resolve) => {
      component.setData({ show: true, ...data })

      component.complete = (res: Dic<string>) => {
        component.setData({ show: false })
        if (resume && component.resume) component.resume()
        resolve(res)
      }
    })) as Promise<any>
  }

  get(page: any, id: string) {
    return page.selectComponent ? page.selectComponent(`#${id}`) : undefined
  }
})()
