import { Translation } from "./Translations"

export interface Options {
    zeroDate: Date
    startDate: Date
    monthCount: number
    rtl: boolean
    from: HTMLInputElement | string
    to: HTMLInputElement | string
    lang: string
    listMode: boolean | string
    inOutTime: number
    visibleByDefault: boolean
    autoSubmit: boolean
    translation: Translation
    weekStartsWith: number
    showOverflow: boolean
    inlineMode: boolean
    contextElement: HTMLElement | string
}