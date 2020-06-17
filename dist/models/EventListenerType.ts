export type OnChangeListenerType = (date1: Date, date2: Date) => void
export type OnFirstDateSelectedListerType = (date: Date) => void
export type OnSecondDateSelectedListenerType = (date: Date) => void
export type OnReadyListenerType = (date1: Date, date2: Date) => void
export type OnShowListenerType = (date1: Date, date2: Date) => void
export type OnHideListenerType = (date1: Date, date2: Date) => void
export type OnBeforeHideListenerType = (date1: Date, date2: Date) => void

export type EventListenerType =
    OnChangeListenerType
  | OnFirstDateSelectedListerType
  | OnSecondDateSelectedListenerType
  | OnReadyListenerType
  | OnShowListenerType
  | OnHideListenerType
  | OnBeforeHideListenerType
