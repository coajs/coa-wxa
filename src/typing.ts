type Basic = string | number | boolean

export interface Dic<T> {
  [index: string]: T
}

export interface DataSet {
  [index: string]: Basic | Basic[] | DataSet | DataSet[]
}
