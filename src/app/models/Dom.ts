import { IDateItem } from './IDateItem';

export interface Dom {
  datepickerWrapper: HTMLElement
  datepickerContainer: HTMLElement
  container: Element
  datepickerTitle: HTMLElement
  datepickerSubmit: HTMLElement
  uiFromDate: HTMLElement
  uiToDate: HTMLElement
  selectedMonthRef: HTMLElement
  calendarDates: IDateItem[]
  calendars: HTMLElement[]
  listModePrev: HTMLElement
  listModeNext: HTMLElement
  loader: HTMLElement
}
