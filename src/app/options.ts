export interface Options {
  startDate: Date
  monthCount: number
  rtl: boolean
  from: HTMLInputElement | string
  to: HTMLInputElement | string
  lang: string
}

export const defaultOptions: Options = {
    startDate: new Date()
  , monthCount: 36
  , rtl: false
  , from: null
  , to: null
  , lang: 'en'
}
