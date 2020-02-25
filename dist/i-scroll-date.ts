import { EventType } from './models/EventType';
import { EventListenerType } from './models/EventListenerType';
import { IDateData } from './models/IDateData';

export interface IScrollDate {
  /**
   * Set enabled starting date for datepicker (min date)
   * @param {string | Date} d
   */
  SetStartDate(d: string | Date): void

  /**
   * Get datepicker start date
   */
  GetStartDate(): string | Date

  /**
   * Set enabled starting date to Today
   */
  ClearStartDate(): void

  /**
   * Unbind datepicker and remove from DOM
   */
  Unbind(): void

  /**
   * Get selected from date
   */
  GetFromDate(): Date

  /**
   * Get selected to date
   */
  GetToDate(): Date

  /**
   * Set from date
   * @param {string | Date} d
   */
  SetFromDate(d: string | Date): void

  /**
   * Set to date
   * @param {string | Date} d
   */
  SetToDate(d: string | Date): void

  /**
   * Increase from date by 1 day
   */
  FromDateNext(): void

  /**
   * Decrease from date by 1 day
   */
  FromDatePrev(): void

  /**
   * Increase to date by 1 day
   */
  ToDateNext(): void

  /**
   * Decrease to date by 1 day
   */
  ToDatePrev(): void

  /**
   * Returns if datepicker is visible (.visible && !.out)
   */
  Visible(): boolean

  /**
   * Returns if datepicker is in single-date select mode
   */
  IsSingleDateMode(): boolean

  /**
   * Hide datepicker
   */
  Hide(triggerEvent?: boolean): Promise<void>

  /**
   * Show datepicker
   */
  Show(triggerEvent?: boolean): Promise<void>

  /**
   * Re-render and re-bind the datepicker
   */
  Render(): Promise<void>

  /**
   * Turn next page (enable listMode via option props or set 'list-mode' attribute to true or 1)
   */
  NextPage(): void

  /**
   * Turn previous page (enable listMode via option props or set 'list-mode' attribute to true or 1)
   */
  PrevPage(): void

  /**
   * Set exact page to show by date (enable listMode via option props or set 'list-mode' attribute to true or 1)
   * @param {string | Date} d
   */
  SetListDatePageByDate(d: string | Date): void

  /**
   * Set exact page to show by index (enable listMode via option props or set 'list-mode' attribute to true or 1)
   * @param {number} index
   */
  SetListDatePageByIndex(index: number): void

  /**
   * Add event listener to ScrollDate events
   * @param {string} eventType event name
   * @param eventListener event listener delegage reference
   */
  AddEventListener(eventType: EventType, eventListener: EventListenerType): void

  /**
   * Remove event listener from ScrollDate events
   * @param {string} eventType event name
   * @param eventListener event listener delegage reference
   */
  RemoveEventListener(eventType: EventType, eventListener: EventListenerType): void

  /**
   * Set datepicker into single date select mode (from date-range mode)
   */
  SetSingleDateMode(): void

  /**
   * Set datepicker into date-range select mode
   */
  SetDateRangeMode(): void

  /**
   * Render provided strings or DOM nodes to the specified dates td
   * @param {IDateData} dateData dates data object array
   */
  RenderDatesData(datesData: IDateData[], disableDatesWithoutData: boolean, deselectDates: boolean): Promise<void>

  /**
   * Clear all previously rendered dates data
   */
  ClearDatesData(): void

  /**
   * Show datepicker's loader
   */
  ShowLoader(): void

  /**
   * Hide datepicker's loader
   */
  HideLoader(): void
}