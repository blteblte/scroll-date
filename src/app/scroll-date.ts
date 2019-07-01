/* import ScrollDate css */
import './scroll-date.scss';

import { ScrollDateBase } from './scroll-date-base';
import { Options } from './options';
import { EventType } from './models/EventType';
import { EventListenerType } from './models/EventListenerType';

/**
 * Scrollable datepicker
 */
export class ScrollDate extends ScrollDateBase {
    public constructor(
        protected host: HTMLElement
        , userOptions: Options = ({} as any)
    ) {
        super(host, userOptions)
    }

    /**
     * Set enabled starting date for datepicker (min date)
     * @param {string | Date} d
     */
    public SetStartDate(d: string | Date) {
        super.SetStartDate(d)
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
    protected FromDateNext() {
        super.FromDateNext()
    }

    /**
     * Decrease from date by 1 day
     */
    protected FromDatePrev() {
        super.FromDatePrev()
    }

    /**
     * Increase to date by 1 day
     */
    protected ToDateNext() {
        super.ToDateNext()
    }

    /**
     * Decrease to date by 1 day
     */
    protected ToDatePrev() {
        super.ToDatePrev()
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
    public async Hide() {
        await super.Hide()
    }

    /**
     * Show datepicker
     */
    protected async Show() {
        await super.Show()
    }

    /**
     * Re-render and re-bind the datepicker
     */
    protected async Render() {
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
    protected AddEventListener(eventType: EventType, eventListener: EventListenerType) {
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
