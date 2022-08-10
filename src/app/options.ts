import { parseDate } from './helpers';
import { Options } from './models/Options';

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
  , translation: null
  , weekStartsWith: 7 /* sunday by default */
  , showOverflow: true
  , inlineMode: false
  , contextElement: null
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
    if (obj.listMode !== 'single') {
      obj.listMode = obj.listMode === 'true' || obj.listMode === '1'
    }
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

  if (typeof obj.translation === 'string') {
    obj.translation = JSON.parse(obj.translation)
  }

  if (typeof obj.weekStartsWith === 'string') {
    obj.weekStartsWith = parseInt(obj.weekStartsWith, 10)
  }

  if (obj.weekStartsWith < 1) {
    obj.weekStartsWith = 1
  }
  else if (obj.weekStartsWith > 7){
    obj.weekStartsWith = 7
  }

  if (typeof obj.showOverflow === 'string') {
    obj.showOverflow = obj.showOverflow === 'true' || obj.showOverflow === '1'
  }

  if (typeof obj.inlineMode === 'string') {
    obj.inlineMode = obj.inlineMode === 'true' || obj.inlineMode === '1'
  }

  return obj
}
