import { parseDate } from "./helpers";

export interface Options {
  zeroDate: Date
  startDate: Date
  monthCount: number
  rtl: boolean
  from: HTMLInputElement | string
  to: HTMLInputElement | string
  lang: string
  listMode: boolean
  inOutTime: number
  visibleByDefault: boolean
  autoSubmit: boolean
}

export const defaultOptions: Options = {
    zeroDate: new Date()
  , startDate: new Date()
  , monthCount: 36
  , rtl: false
  , from: null
  , to: null
  , lang: 'en'
  , listMode: false
  , inOutTime: 300
  , visibleByDefault: false
  , autoSubmit: false
}

export function parseOptions(obj: Options): Options {

  if (typeof obj.zeroDate === 'string') {
    obj.zeroDate = parseDate(obj.zeroDate)
  }

  if (typeof obj.startDate === 'string') {
    obj.startDate = parseDate(obj.startDate)
  }

  if (typeof obj.monthCount === 'string') {
    obj.monthCount = parseInt(obj.monthCount, 10)
  }

  if (typeof obj.rtl === 'string') {
    obj.rtl = obj.rtl === 'true' || obj.rtl === '1'
  }

  if (typeof obj.listMode === 'string') {
    obj.listMode = obj.listMode === 'true' || obj.listMode === '1'
  }

  if (typeof obj.inOutTime === 'string') {
    obj.inOutTime = parseInt(obj.inOutTime, 10)
  }

  if (typeof obj.visibleByDefault === 'string') {
    obj.visibleByDefault = obj.visibleByDefault === 'true' || obj.visibleByDefault === '1'
  }

  if (typeof obj.autoSubmit === 'string') {
    obj.autoSubmit = obj.autoSubmit === 'true' || obj.autoSubmit === '1'
  }

  return obj
}
