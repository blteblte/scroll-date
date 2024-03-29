/* import ScrollDate css */
import './scroll-date.scss';

import { ScrollDateBase } from './scroll-date-base';
import { EventType } from './models/EventType';
import { EventListenerType } from './models/EventListenerType';
import { IScrollDate } from './i-scroll-date';
import { IDateData } from './models/IDateData';
import { Options } from './models/Options';

/**
 * Scrollable datepicker
 */
export class ScrollDate extends ScrollDateBase implements IScrollDate {

    public ShowLoader() {
        super.ShowLoader()
    }

    public HideLoader() {
        super.HideLoader()
    }

    public RenderDatesData(datesData: IDateData[], disableDatesWithoutData: boolean, deselectDates: boolean): Promise<void> {
        return super.RenderDatesData(datesData, disableDatesWithoutData, deselectDates)
    }

    public ClearDatesData(): void {
        super.ClearDatesData()
    }

    public constructor(
        protected host: HTMLElement
        , userOptions: Options = ({} as any)
        , contextContainer: Document | Element = document
    ) {
        super(host, userOptions, contextContainer)
    }

    /**
     * Set enabled starting date for datepicker (min date)
     * @param {string | Date} d
     */
    public SetStartDate(d: string | Date) {
        super.SetStartDate(d)
    }

    /**
     * Get datepicker start date
     */
    public GetStartDate() {
        return super.GetStartDate()
    }

    /**
     * Set enabled starting date to Today
     */
    public ClearStartDate() {
        super.ClearStartDate()
    }

    /**
     * Unbind datepicker and remove from DOM
     */
    public Unbind() {
        super.Unbind()
    }

    /**
     * Get selected from date
     */
    public GetFromDate() {
        return super.GetFromDate()
    }

    /**
     * Get selected to date
     */
    public GetToDate() {
        return super.GetToDate()
    }

    /**
     * Set from date
     * @param {string | Date} d
     */
    public SetFromDate(d: string | Date) {
        super.SetFromDate(d)
    }

    /**
     * Set to date
     * @param {string | Date} d
     */
    public SetToDate(d: string | Date) {
        super.SetToDate(d)
    }

    /**
     * Increase from date by 1 day
     */
    public FromDateNext(dispatchEvent = true) {
        super.FromDateNext(dispatchEvent)
    }

    /**
     * Decrease from date by 1 day
     */
    public FromDatePrev(dispatchEvent = true) {
        super.FromDatePrev(dispatchEvent)
    }

    /**
     * Increase to date by 1 day
     */
    public ToDateNext(dispatchEvent = true) {
        super.ToDateNext(dispatchEvent)
    }

    /**
     * Decrease to date by 1 day
     */
    public ToDatePrev(dispatchEvent = true) {
        super.ToDatePrev(dispatchEvent)
    }

    /**
     * Returns if datepicker is visible (.visible && !.out)
     */
    public Visible() {
        return super.Visible()
    }

    /**
     * Returns if datepicker is in single-date select mode
     */
    public IsSingleDateMode() {
        return super.IsSingleDateMode()
    }

    /**
     * Hide datepicker
     */
    public async Hide(triggerEvent = true) {
        await super.Hide(triggerEvent)
    }

    /**
     * Show datepicker
     */
    public async Show(triggerEvent = true) {
        await super.Show(triggerEvent)
    }

    /**
     * Re-render and re-bind the datepicker
     */
    public async Render() {
        await super.Render()
    }

    /**
     * Turn next page (enable listMode via option props or set 'list-mode' attribute to true or 1)
     */
    public NextPage() {
        super.NextPage()
    }

    /**
     * Turn previous page (enable listMode via option props or set 'list-mode' attribute to true or 1)
     */
    public PrevPage() {
        super.PrevPage()
    }

    /**
     * Set exact page to show by date (enable listMode via option props or set 'list-mode' attribute to true or 1)
     * @param {string | Date} d
     */
    public SetListDatePageByDate(d: string | Date) {
        super.SetListDatePageByDate(d)
    }

    /**
     * Set exact page to show by index (enable listMode via option props or set 'list-mode' attribute to true or 1)
     * @param {number} index
     */
    public SetListDatePageByIndex(index: number) {
        super.SetListDatePageByIndex(index)
    }

    /**
     * Add event listener to ScrollDate events
     * @param {string} eventType event name
     * @param eventListener event listener delegage reference
     */
    public AddEventListener(eventType: EventType, eventListener: EventListenerType) {
        super.AddEventListener(eventType, eventListener)
    }

    /**
     * Remove event listener from ScrollDate events
     * @param {string} eventType event name
     * @param eventListener event listener delegage reference
     */
    public RemoveEventListener(eventType: EventType, eventListener: EventListenerType) {
        super.RemoveEventListener(eventType, eventListener)
    }

    /**
     * Set datepicker into single date select mode (from date-range mode)
     */
    public SetSingleDateMode() {
        super.SetSingleDateMode()
    }

    /**
     * Set datepicker into date-range select mode
     */
    public SetDateRangeMode() {
        super.SetDateRangeMode()
    }
}
