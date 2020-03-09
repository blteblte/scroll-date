
/**
 * TODO:
 * REFACTOR!!!
 */

import {
    camelCaseToDash
  , getDatePickerPlaceholderDate
  , parseDate
  , isDatesEqual
  , getDateISOFormat
  , isDateObjectValid
} from './helpers';
import { Options, defaultOptions, parseOptions } from './options';
import { EventListenerType } from './models/EventListenerType';
import { ScrollDateEvent } from './models/ScrollDateEvent';
import { generateCalendarHTML } from './lib/generate';
import { EventType } from './models/EventType';
import { IDateItem } from './models/IDateItem';
import { translations, Translation } from './translations';
import { Targets } from './models/Targets';
import { State } from './models/State';
import { Dom } from './models/Dom';
import { isFunction } from 'util';
import { IDateData } from './models/IDateData';


export class ScrollDateBase {

  private tr: Translation

  private events: ScrollDateEvent[]

  private options: Options

  private _targets: Targets = {
      dateFromInput: null,
      dateToInput: null
  }

  private _dom: Dom = {
      datepickerWrapper: null,
      datepickerContainer: null,
      container: null,
      datepickerTitle: null,
      datepickerSubmit: null,
      uiFromDate: null,
      uiToDate: null,
      selectedMonthRef: null,
      calendarDates: null,
      calendars: null,
      listModePrev: null,
      listModeNext: null,
      loader: null
  }

  private _state: State = {
      singleDateMode: false,
      isRendered: false,
      selectingCount: 0,
      startDate: null,
      zeroDate: null,
      date1: null,
      date2: null,
      cachedDate2: null,
      listModePageIndex: null,
      onChangeDate1: null,
      onChangeDate2: null,
      firstDataSet: false
  }

  /**
   * Create ScrollDate instance and bind it to 'ScrollDate' prop for host DOM elelement (<scroll-date></scroll-date>)
   * @param {HTMLElement} host <scroll-date ...attr - dash-case {Options}></scroll-date>
   * @param {Options} userOptions ScrollDate options merged with dash-cased attribute options
   */
  protected constructor(
      protected host: HTMLElement
      , userOptions: Options = ({} as any)
      , contextContainer: Document | Element = document
  ) {
      /* set reference to this class on the element it self */
      host['ScrollDate'] = this

      this.init(userOptions, contextContainer)
  }

  private async init(userOptions: Options, contextContainer) {
      this.events = []

      /* set default */
      const scrollDateOptions = { ...defaultOptions }

      /* get from tag attributes */
      Object.keys(scrollDateOptions).forEach((key) => {
          const attributeName = camelCaseToDash(key)
          const attributeValue = this.host.getAttribute(attributeName)
          if (attributeValue) {
              scrollDateOptions[key] = attributeValue
          }
      })

      this.options = { ...scrollDateOptions, ...userOptions }
      this.options = parseOptions(this.options)

      if (this.options.inlineMode) {
          this.options.showOverflow = false
      }

      if (typeof this.options.from === 'string') {
          this._targets.dateFromInput = contextContainer.querySelector(this.options.from)
      } else {
          this._targets.dateFromInput = this.options.from
      }

      if (this.options.to) {
          if (typeof this.options.to === 'string') {
              this._targets.dateToInput = contextContainer.querySelector(this.options.to)
          } else {
              this._targets.dateToInput = this.options.to
          }
      }

      if (this.options.contextElement && typeof this.options.contextElement === 'string') {
          this.options.contextElement = document.querySelector(this.options.contextElement) as HTMLElement
      }

      if (!this._targets.dateToInput) {
          this._state.singleDateMode = true
      }

      this._dom.datepickerWrapper = document.createElement('div')
      this._dom.datepickerWrapper.classList.add('scroll-date')

      this._dom.loader = document.createElement('div')
      this._dom.loader.classList.add('scroll-date-loader')
      this._dom.loader.innerHTML = `<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#000">
            <g fill="none" fill-rule="evenodd">
                <g transform="translate(1 1)" stroke-width="2">
                    <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                        <animateTransform attributeName="transform"
                                            type="rotate"
                                            from="0 18 18"
                                            to="360 18 18"
                                            dur="1s"
                                            repeatCount="indefinite" />
                    </path>
                </g>
            </g>
        </svg>`
      this._dom.datepickerWrapper.appendChild(this._dom.loader)

      this._state.zeroDate = this.options.zeroDate
      this._state.zeroDate.setHours(0, 0, 0, 0)

      /* set startdate */
      this._state.startDate = this.options.startDate
      this._state.startDate.setHours(0, 0, 0, 0)

      /* set starting dates */
      let date1 = this.addDays(this._state.zeroDate, 0)
      let date2 = this.addDays(this._state.zeroDate, 7)

      const fromDateInputValue = this._targets.dateFromInput.value
      const fromDateInputValueDate = parseDate(fromDateInputValue)
      if (isDateObjectValid(fromDateInputValueDate) && fromDateInputValueDate > this.options.startDate) {
          date1 = fromDateInputValueDate
          date2 = this.addDays(fromDateInputValueDate, 7)
      }

      if (this._targets.dateToInput) {
          const toDateInputValue = this._targets.dateToInput.value
          const toDateInputValueDate = parseDate(toDateInputValue)
          if (isDateObjectValid(toDateInputValueDate) && toDateInputValueDate >= date1) {
              date2 = toDateInputValueDate
          }
      }

      /* dafault date values */
      this._state.date1 = date1
      this._state.date2 = date2

      if (this._state.date1 > this._state.date2) {
          this._state.date2 = this._state.date1
      }

      this.apply(this._state.date1, this._state.date2)

      this._targets.dateFromInput.addEventListener('focus', () => this.Show())

      if (this._targets.dateToInput) {
          this._targets.dateToInput.addEventListener('focus', () => this.Show())
      }

      /* apply translations */
      this.tr = translations[this.options.lang]
      if (this.options.translation !== null) {
          this.tr = this.options.translation
      }

      await this.Render()

      this._state.onChangeDate1 = this._state.date1
      this._state.onChangeDate2 = this._state.date2
      this.triggerEvent('onready', this._state.date1, this._state.date2)
  }


  private _firstSelectedDate: IDateItem
  private get firstSelectedDate(): IDateItem {
      return this._firstSelectedDate
  }
  private set firstSelectedDate(dt: IDateItem) {
      if (dt === undefined || dt === null) {
          this.UI_unselectDate(this.firstSelectedDate, 'first')
      } else {
          this.UI_selectDate(dt, 'first')
          this._dom.uiFromDate.innerHTML = getDatePickerPlaceholderDate(dt.date)
          this.triggerEvent('onfirstselected', dt.date)
      }
      this._firstSelectedDate = dt
      if (dt !== undefined && dt !== null) {
          this._dom.selectedMonthRef = dt.ref.parentElement/*tr*/.parentElement/*tbody*/.parentElement/*table*/
      }
      this.updateCalendarConnectDates()
  }

  private _secondSelectedDate: IDateItem
  private get secondSelectedDate(): IDateItem {
      return this._secondSelectedDate
  }
  private set secondSelectedDate(dt: IDateItem) {
      if (dt === undefined || dt === null) {
          this.UI_unselectDate(this.secondSelectedDate, 'second')
      } else {
          this.UI_selectDate(dt, 'second')
          this._dom.uiToDate.innerHTML = getDatePickerPlaceholderDate(dt.date)

          if (!this._dom.datepickerSubmit.classList.contains('flash')) {
              this._dom.datepickerSubmit.classList.add('flash')
              setTimeout(() => {
                  this._dom.datepickerSubmit.classList.contains('flash')
                      && this._dom.datepickerSubmit.classList.remove('flash')
              }, 150)
          }
          this.triggerEvent('onsecondselected', dt.date)
      }
      this._secondSelectedDate = dt
      this.updateCalendarConnectDates()
  }

  protected SetStartDate(d: string | Date) {
      if (typeof d === 'string' || d instanceof String) {
          d = parseDate(d as string)
          d.setHours(0, 0, 0, 0)
      }

      this._state.startDate = d
      this.updateCalendarStartDate()
      if (this._state.startDate > this._state.date1) {
          this.SetFromDate(d)
      }
      if (this._state.startDate > this._state.date2) {
          this.SetToDate(d)
      }
      this._state.selectingCount = 0
  }

  protected GetStartDate() {
      return this._state.startDate
  }

  protected FromDateNext() {
      const newDate = this.addDays(this._state.date1, +1)
      this.SetFromDate(newDate)
      if (this.options.listMode) {
        this.SetListDatePageByDate(newDate)
      }
  }

  protected FromDatePrev() {
      const newDate = this.addDays(this._state.date1, -1)
      this.SetFromDate(newDate)
      if (this.options.listMode) {
        this.SetListDatePageByDate(newDate)
      }
  }

  protected ToDateNext() {
      const newDate = this.addDays(this._state.date2, +1)
      this.SetToDate(newDate)
      if (this.options.listMode) {
        this.SetListDatePageByDate(newDate)
      }
  }

  protected ToDatePrev() {
      const newDate = this.addDays(this._state.date2, -1)
      this.SetToDate(newDate)
      if (this.options.listMode) {
        this.SetListDatePageByDate(newDate)
      }
  }

  protected ClearStartDate() {
      this._state.startDate = this._state.zeroDate
      this.updateCalendarStartDate()
      this._state.selectingCount = 0
  }

  protected Unbind() {
      if (this._state.isRendered) {
          this._dom.container.removeChild(this._dom.datepickerWrapper)
          this._state.selectingCount = 0
      }
  }

  protected GetFromDate() {
      return this._state.date1
  }

  protected GetToDate() {
      return this._state.date2
  }

  protected SetFromDate(d: string | Date) {
    if (d === null) {
        this._state.date1 = null
        this.updateCalendarSelectFirstDate(null)
        this.apply(this._state.date1, this._state.date2)
        return
    }

    if (typeof d === 'string' || d instanceof String) {
        d = parseDate(d as string)
        d.setHours(0, 0, 0, 0)
    }
    if (this._state.startDate > d) { return }
    this._state.date1 = d
    this.updateCalendarSelectFirstDate(d)
    if (this.IsSingleDateMode() && this._state.isRendered) {
        this.updateCalendarSelectSecondDate(d)
            if (this._dom.selectedMonthRef) {
            const monthRefOffset = this._dom.selectedMonthRef.offsetTop
            this._dom.datepickerContainer.scrollTop = monthRefOffset

            if (this.options.listMode) {
                this.SetListDatePageByDate(d)
            }
        }
    }
    this.apply(this._state.date1, this._state.date2)
    this._state.selectingCount = 0
    if (d > this._state.date2) {
        this.SetToDate(d)
    }
  }

  protected SetToDate(d: string | Date) {
      if (d === null) {
        this._state.date2 = null
        this.updateCalendarSelectSecondDate(null)
        this.apply(this._state.date1, this._state.date2)
        return
      }
      if (typeof d === 'string' || d instanceof String) {
          d = parseDate(d as string)
          d.setHours(0, 0, 0, 0)
      }
      if (this._state.startDate > d) { return }
      this._state.date2 = d
      this.updateCalendarSelectSecondDate(d)
      if (this.IsSingleDateMode() && this._state.isRendered) {
          this.updateCalendarSelectFirstDate(d)
          if (this._dom.selectedMonthRef) {
            const monthRefOffset = this._dom.selectedMonthRef.offsetTop
            this._dom.datepickerContainer.scrollTop = monthRefOffset

            if (this.options.listMode) {
                this.SetListDatePageByDate(d)
            }
        }
      }
      this.apply(this._state.date1, this._state.date2)
      this._state.selectingCount = 0
      if (d < this._state.date1) {
          this.SetFromDate(d)
      }
  }

  protected Visible() {
      return this._dom.datepickerWrapper.classList.contains('visible')
          && !this._dom.datepickerWrapper.classList.contains('out')
  }

  protected IsSingleDateMode() {
      return this._state.singleDateMode
  }

  private hideOnClickOutside() {
    const outsideClickListener = event => {
        const isOutsideElements =
               !this._dom.container.contains(event.target)
            && this._targets.dateFromInput !== event.target
            && (!this._targets.dateToInput || this._targets.dateToInput !== event.target)
            && (!this.options.contextElement || (
                this.options.contextElement
                &&
                !(this.options.contextElement as HTMLElement).contains(event.target)
            ))
        if (isOutsideElements && this.Visible()) {
          this.Hide()
          removeClickListener()
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    }

    document.addEventListener('click', outsideClickListener)
}

  protected async Hide(triggerEvent = true) {
    if (this.options.inlineMode) { return }
      if (!this.Visible()) { return }

      const { datepickerWrapper } = this._dom
      datepickerWrapper.classList.contains('visible') && datepickerWrapper.classList.remove('visible')
      if (!this.options.listMode) {
          document.body.style.overflowY = 'auto';
      }

      await this.wait(this.options.inOutTime)
      if (!datepickerWrapper.classList.contains('out') && !this.Visible()) {
          datepickerWrapper.classList.add('out')
      }
      triggerEvent && this.triggerEvent('onhide', this._state.date1, this._state.date2)
  }

  protected ShowLoader() {
    this._dom.loader.classList.add('visible')
  }

  protected HideLoader() {
    this._dom.loader.classList.remove('visible')
  }

  protected async Show(triggerEvent = true) {
      if (this.options.inlineMode) { return }
      if (this.Visible()) { return }

      !this.options.showOverflow && this.hideOnClickOutside()

      const { datepickerWrapper } = this._dom
      this.SetFromDate(this._state.date1)
      this.SetToDate(this._state.date2)
      datepickerWrapper.classList.contains('out') && datepickerWrapper.classList.remove('out')
      if (!this.options.listMode) {
          document.body.style.overflowY = 'hidden';
      }
      if (this._dom.selectedMonthRef) {
          const monthRefOffset = this._dom.selectedMonthRef.offsetTop
          this._dom.datepickerContainer.scrollTop = monthRefOffset

          if (this.options.listMode) {
              this.SetListDatePageByDate(this._state.date1)
          }
      }

      await this.wait(10)
      !datepickerWrapper.classList.contains('visible') && datepickerWrapper.classList.add('visible')
      triggerEvent && this.triggerEvent('onshow', this._state.date1, this._state.date2)
  }

  protected async Render() {
      const { datepickerWrapper } = this._dom

      if (this.options.rtl && !datepickerWrapper.classList.contains('rtl')) {
          datepickerWrapper.classList.add('rtl')
      }

      if (this.options.listMode && !datepickerWrapper.classList.contains('list-mode')) {
          datepickerWrapper.classList.add('list-mode')
      }

      if (this.options.listMode === 'single') {
        datepickerWrapper.classList.add('single-callendar')
      }

      if (this.options.autoSubmit && !datepickerWrapper.classList.contains('auto-submit')) {
          datepickerWrapper.classList.add('auto-submit')
      }

      if (this.options.inlineMode) {
          datepickerWrapper.classList.add('inline-mode')
      }

      await this.render(this.options.startDate, this.options.monthCount, this.host, true, this.options.rtl)
      await this.bind()

      if (this.options.listMode) {
        this.renderListMode()
      }

      this.SetFromDate(this._state.date1)
      this.SetToDate(this._state.date2)

      if (this._state.singleDateMode) {
          this.SetSingleDateMode()
      }

      if (this.options.visibleByDefault) {
          !datepickerWrapper.classList.contains('visible') && datepickerWrapper.classList.add('visible')
      } else {
          !datepickerWrapper.classList.contains('out') && datepickerWrapper.classList.add('out')
      }
  }

  private renderListMode() {
      const listModelControllsContainer = document.createElement('div')
      listModelControllsContainer.className = 'scroll-date__list-mode-controls'

      const prevButton = document.createElement('div')
      prevButton.className = 'prev'
      prevButton.addEventListener('click', () => this.PrevPage())
      this._dom.listModePrev = prevButton

      const nextButton = document.createElement('div')
      nextButton.className = 'next'
      nextButton.addEventListener('click', () => this.NextPage())
      this._dom.listModeNext = nextButton

      listModelControllsContainer.appendChild(prevButton)
      listModelControllsContainer.appendChild(nextButton)

      this._dom.datepickerContainer.appendChild(listModelControllsContainer)

      this.SetListDatePageByDate(this._state.date1)
  }

  protected NextPage() {
      this.SetListDatePageByIndex(++this._state.listModePageIndex)
  }

  protected PrevPage() {
      this.SetListDatePageByIndex(--this._state.listModePageIndex)
  }

  protected SetListDatePageByDate(d: string | Date) {
      if (d === null) { return }

      if (typeof d === 'string' || d instanceof String) {
          d = parseDate(d as string)
          d.setHours(0, 0, 0, 0)
      }

      const dt = this._dom.calendarDates.find((x) => isDatesEqual(x.date, d))
      const index = parseInt(dt.callendar.getAttribute('data-index'), 10)
      this.SetListDatePageByIndex(index)
  }

  protected SetListDatePageByIndex(index: number) {
      const { options } = this
      const maxIndex = this._dom.calendars.length - 1

      if (index < 0) { index = 0 }

      let firstIndex = index
      let secondIndex = options.listMode === 'single'
        ? index
        : index + 1

      if (secondIndex > maxIndex) {
          secondIndex = maxIndex
          firstIndex = options.listMode === 'single'
            ? maxIndex
            : maxIndex - 1
      }

      this._state.listModePageIndex = firstIndex

      if (firstIndex === 0) {
          !this._dom.listModePrev.classList.contains('disabled')
            && this._dom.listModePrev.classList.add('disabled')
      } else {
          this._dom.listModePrev.classList.contains('disabled')
            && this._dom.listModePrev.classList.remove('disabled')
      }

      if (secondIndex === maxIndex) {
          !this._dom.listModeNext.classList.contains('disabled')
            && this._dom.listModeNext.classList.add('disabled')
      } else {
          this._dom.listModeNext.classList.contains('disabled')
            && this._dom.listModeNext.classList.remove('disabled')
      }

      this._dom.calendars.forEach((calendar, i) => {
          if (i === firstIndex || i === secondIndex) {
              !calendar.classList.contains('visible')
                  && calendar.classList.add('visible')
          } else {
              calendar.classList.contains('visible')
                  && calendar.classList.remove('visible')
          }
      })
  }

  private async render(
      drawingStartDate: Date
      , monthCountToDraw: number
      , container: Element
      , clearContainer: boolean = true
      , rtl: boolean = false
  ) {
      const calendarHtml = await generateCalendarHTML(drawingStartDate, monthCountToDraw, this.options.lang, this.options.weekStartsWith)

      if (clearContainer) {
          container.innerHTML = ''
      }

      /* header */
      const headerContainer = document.createElement('div')
      headerContainer.className = 'scroll-date__header'
      this._dom.datepickerTitle = document.createElement('div')
      this._dom.datepickerTitle.className = 'scroll-date__header--title'
      this._dom.datepickerTitle.innerHTML = this.tr.selectDates

      const closeButton = document.createElement('span')
      closeButton.className = 'scroll-date__header--close'
      closeButton.addEventListener('click', () => this.Hide())

      const backButton = document.createElement('span')
      backButton.className = 'scroll-date__header--back-button'
      backButton.addEventListener('click', () => this.Hide())

      headerContainer.appendChild(this._dom.datepickerTitle)
      headerContainer.appendChild(closeButton)
      headerContainer.appendChild(backButton)

      /* datepicker */
      this._dom.datepickerContainer = document.createElement('div')
      this._dom.datepickerContainer.className = 'scroll-date__container'
      this._dom.datepickerContainer.innerHTML = calendarHtml

      /* ui footer */
      const datepickerUIContainer = document.createElement('div')
      datepickerUIContainer.className = 'scroll-date__ui'
      const uiDatesContainer = document.createElement('div')
      uiDatesContainer.className = 'scroll-date__ui--dates'
      this._dom.uiFromDate = document.createElement('div')
      this._dom.uiFromDate.className = 'scroll-date__ui--dates--from'
      this._dom.uiToDate = document.createElement('div')
      this._dom.uiToDate.className = 'scroll-date__ui--dates--to'

      if (!rtl) {
          uiDatesContainer.appendChild(this._dom.uiFromDate)
          uiDatesContainer.appendChild(this._dom.uiToDate)
      } else {
          uiDatesContainer.appendChild(this._dom.uiToDate)
          uiDatesContainer.appendChild(this._dom.uiFromDate)
      }


      const uiSubmitContainer = document.createElement('div')
      uiSubmitContainer.className = 'scroll-date__ui--submit-container'
      this._dom.datepickerSubmit = document.createElement('span')
      this._dom.datepickerSubmit.className = 'scroll-date__ui--submit-container__submit'
      this._dom.datepickerSubmit.innerHTML = this.tr.selectTheseDates
      this._dom.datepickerSubmit.addEventListener('click', () => {
          this.submitClose()
      })
      uiSubmitContainer.appendChild(this._dom.datepickerSubmit)
      datepickerUIContainer.appendChild(uiDatesContainer)
      datepickerUIContainer.appendChild(uiSubmitContainer)

      /* overflow */
      const overflow = document.createElement('div')
      overflow.className = 'scroll-date__overflow'
      this._dom.datepickerWrapper.appendChild(overflow)
      overflow.addEventListener('click', () => this.Hide())
      if (!this.options.showOverflow) {
        overflow.style.display = 'none'
      }

      this._dom.datepickerWrapper.appendChild(headerContainer)
      this._dom.datepickerWrapper.appendChild(this._dom.datepickerContainer)
      this._dom.datepickerWrapper.appendChild(datepickerUIContainer)

      container.appendChild(this._dom.datepickerWrapper)
      this._dom.container = container
      this._state.isRendered = true
  }

  private submitClose() {
      this._state.date1 = this.firstSelectedDate.date
      this._state.date2 = (this.secondSelectedDate || this.firstSelectedDate).date
      this.apply(this._state.date1, this._state.date2)
      this.Hide()
  }

  private async bind() {
      const tds = Array.prototype.slice.call(
          this._dom.datepickerWrapper.querySelectorAll('td[data-timestamp]')
      ) as HTMLElement[]

      this._dom.calendars = Array.prototype.slice.call(
          this._dom.datepickerWrapper.querySelectorAll('.calendar')
      ) as HTMLElement[]

      this._dom.calendars.forEach((calendar, i) => {
          calendar.setAttribute('data-index', i.toString())
      })

      this._dom.calendarDates = tds.map((td) => {
          const tdDate = new Date(parseInt(td.getAttribute('data-timestamp')))
          tdDate.setHours(0, 0, 0, 0)
          return {
              date: tdDate,
              ref: td,
              callendar: td.parentElement.parentElement.parentElement
          } as IDateItem
      })

      this.updateCalendarStartDate()
      this.bindCalendarClickListeners()
  }

  protected SetSingleDateMode() {
      this._dom.datepickerTitle.innerHTML = this.tr.selectDate
      this._dom.datepickerSubmit.innerHTML = this.tr.selectThisDate

      if (!this._state.cachedDate2) {
          this._state.cachedDate2 = this._state.date2
      }

      this.SetToDate(this._state.date1)

      !this._dom.datepickerWrapper.classList.contains('single-date')
          && this._dom.datepickerWrapper.classList.add('single-date')

      this._state.singleDateMode = true
  }

  protected SetDateRangeMode() {
      this._dom.datepickerTitle.innerHTML = this.tr.selectDates
      this._dom.datepickerSubmit.innerHTML = this.tr.selectTheseDates

      if (this._state.cachedDate2) {
          if (this._state.cachedDate2 > this._state.date1) {
              this._state.singleDateMode = false
              this.SetToDate(this._state.cachedDate2)
          }
          this._state.cachedDate2 = undefined
      }

      this._dom.datepickerWrapper.classList.contains('single-date')
          && this._dom.datepickerWrapper.classList.remove('single-date')

      this._state.singleDateMode = false
  }

  private apply(date1: Date, date2: Date) {
      this._state.date1 = date1
      const txt1 = getDatePickerPlaceholderDate(this._state.date1)
      this._targets.dateFromInput.placeholder = txt1
      const isoDate1 = getDateISOFormat(this._state.date1)
      this._targets.dateFromInput.value = isoDate1

      if (!this._state.singleDateMode) {
          this._state.date2 = date2
          const txt2 = getDatePickerPlaceholderDate(this._state.date2)
          this._targets.dateToInput.placeholder = txt2
          const isoDate2 = getDateISOFormat(this._state.date2)
          this._targets.dateToInput.value = isoDate2
      }

      if (this._state.date1 !== this._state.onChangeDate1 || this._state.date2 !== this._state.onChangeDate2) {
          this._state.onChangeDate1 = this._state.date1
          this._state.onChangeDate2 = this._state.date2
          this.triggerEvent('onchange', this._state.date1, this._state.date2)
      }
  }

  private updateCalendarSelectFirstDate(d: Date) {
      if (d === null) {
        this.firstSelectedDate = null
        return
      }
      const dt = this._dom.calendarDates.find((x) => isDatesEqual(x.date, d))
      if (dt) {
          this.firstSelectedDate = dt
      }
  }

  private updateCalendarSelectSecondDate(d: Date) {
      if (d === null) {
        this.secondSelectedDate = null
        return
      }
      const dt = this._dom.calendarDates.find((x) => isDatesEqual(x.date, d))
      if (dt) {
          this.secondSelectedDate = dt
      }
  }

  private UI_selectDate(dt: IDateItem, type: 'first' | 'second') {
      if (type === 'first') {
          if (this.firstSelectedDate === dt) { return }
          else if (this.firstSelectedDate) {
              this.UI_unselectDate(this.firstSelectedDate, type)
          }
      } else {
          if (this.secondSelectedDate === dt) { return }
          else if (this.secondSelectedDate) {
              this.UI_unselectDate(this.secondSelectedDate, type)
          }
      }

      if (!dt.ref.classList.contains('selected')) {
          dt.ref.classList.add('selected')
      }
      if (!dt.ref.classList.contains(type)) {
          dt.ref.classList.add(type)
      }
  }

  private UI_unselectDate(dt: IDateItem, type: 'first' | 'second') {
      if (dt === null) { return }

      if (type === 'first') {
          if (dt.ref.classList.contains('first') && !dt.ref.classList.contains('second')) {
              dt.ref.classList.contains('selected') && dt.ref.classList.remove('selected')
              dt.ref.classList.remove('first')
          } else if (dt.ref.classList.contains('first')) {
              dt.ref.classList.remove('first')
          }
      } else {
          if (dt.ref.classList.contains('second') && !dt.ref.classList.contains('first')) {
              dt.ref.classList.contains('selected') && dt.ref.classList.remove('selected')
              dt.ref.classList.remove('second')
          } else if (dt.ref.classList.contains('second')) {
              dt.ref.classList.remove('second')
          }
      }
  }

  /**
   * Invalidate all dates before current start date
   */
  private updateCalendarStartDate() {
      this._dom.calendarDates.forEach((dt) => {
          if (dt.date < this._state.startDate) {
              !dt.ref.classList.contains('invalid') && dt.ref.classList.add('invalid')
          } else {
              dt.ref.classList.contains('invalid') && dt.ref.classList.remove('invalid')
          }

          if (isDatesEqual(dt.date, this._state.startDate)) {
            dt.ref.classList.contains('invalid') && dt.ref.classList.remove('invalid')
          }
      })
  }

  /**
   * Draw/remove 'connect' class between selected dates
   */
  private updateCalendarConnectDates(toDateOverride: IDateItem = null) {

      if (this.firstSelectedDate == null && this.secondSelectedDate == null) {
        this._dom.calendarDates.forEach((dt) => {
            if (dt.ref.classList.contains('connect')) {
                dt.ref.classList.remove('connect')
            }
        })
        return
      }

      let isFoundFirst = false
      let isFoundSecond = false

      if (!this.secondSelectedDate && toDateOverride === null) {
          this._dom.calendarDates.forEach((dt) => {
              if (dt.ref.classList.contains('connect')) {
                  dt.ref.classList.remove('connect')
              }
          })
      } else if (this.firstSelectedDate) {
          this._dom.calendarDates.forEach((dt) => {
              if (!isFoundFirst) {
                  isFoundFirst = dt.ref.classList.contains('first')
              }
              if ((isFoundFirst && !isFoundSecond)) {
                  !dt.ref.classList.contains('connect') && dt.ref.classList.add('connect')
              } else {
                  dt.ref.classList.contains('connect') && dt.ref.classList.remove('connect')
              }
              if (!isFoundSecond) {
                  if (toDateOverride === null) {
                      isFoundSecond = dt.ref.classList.contains('second')
                  } else {
                      isFoundSecond = isDatesEqual(this.addDays(toDateOverride.date, -1), dt.date)
                  }
              }
          })
      }
  }

  private bindCalendarClickListeners() {
      this._state.selectingCount = 0

      this._dom.calendarDates.forEach((dt) => {
          dt.ref.addEventListener('click', () => {
              if (dt.ref.classList.contains('invalid')) { return }

              const isSingleDateMode = this._state.singleDateMode

              if (this._state.selectingCount === 0) {
                  this._state.selectingCount++
                  if (this.secondSelectedDate) {
                      this.secondSelectedDate = undefined
                  }
                  this.firstSelectedDate = dt
              } else if ((this._state.selectingCount === 1 && dt.date < this.firstSelectedDate.date) || isSingleDateMode) {
                  this.firstSelectedDate = dt
              } else {
                  this._state.selectingCount++
                  this.secondSelectedDate = dt
              }

              if (isSingleDateMode) {
                  this._state.selectingCount = 0
                  if (this.options.autoSubmit) {
                      this.submitClose()
                  }
              } else if (this._state.selectingCount === 2) {
                  this._state.selectingCount = 0
                  if (this.options.autoSubmit) {
                      this.submitClose()
                  }
              }
          })

          dt.ref.addEventListener('mouseenter', (e) => {
              if (this._state.selectingCount === 1 && dt.date > this.firstSelectedDate.date)
                  this.updateCalendarConnectDates(dt)
          })

          dt.ref.addEventListener('mouseleave', (e) => {
              if (this._state.selectingCount === 1 && dt.date > this.firstSelectedDate.date)
                  this.updateCalendarConnectDates()
          })
      })
  }

  private addDays(dt: Date, days: number) {
      if (dt === null) { return dt }
      var date = new Date(dt.valueOf());
      date.setDate(date.getDate() + days);
      return date;
  }

  private wait(ms: number) {
      return new Promise((resolve) => {
          setTimeout(() => resolve(), ms)
      })
  }

  protected AddEventListener(eventType: EventType, eventListener: EventListenerType) {
      this.events.push({ eventType, eventListener })
  }

  protected RemoveEventListener(eventType: EventType, eventListener: EventListenerType) {
      const e = this.events.find((x) => x.eventListener === eventListener && x.eventType === eventType)
      const index = this.events.indexOf(e)
      if (index > -1) {
          this.events.splice(index, 1)
      }
  }

  private triggerEvent(eventType: EventType, date1: Date, date2: Date = undefined) {
      const eventsToFire = this.events.filter((e) => e.eventType === eventType)
      eventsToFire.forEach((e) => {
          if (isFunction)
              e.eventListener(date1, date2)
      })
  }

    protected async RenderDatesData(datesData: IDateData[], disableDatesWithoutData: boolean, deselectDates: boolean): Promise<void> {
        return new Promise((resolve) => {
            const firstDataSet = JSON.parse(JSON.stringify(this._state.firstDataSet))
            this._state.firstDataSet = true

            setTimeout(() => {
                const { _dom } = this
                const { calendarDates } = _dom

                /* detach & normalize data */
                const normalizedDatesData = datesData.map((obj) => {

                    let date = obj.date
                    if (typeof date === 'string' || date instanceof String) {
                        date = parseDate(date as string)
                        date.setHours(0, 0, 0, 0)
                    } else {
                        date.setHours(0, 0, 0, 0)
                    }

                    const data = document.createElement('span')
                    data.classList.add('date-data')
                    if (typeof obj.data === 'string' || obj.data instanceof String ) {
                        data.innerHTML = obj.data as string
                    } else {
                        data.appendChild(obj.data as HTMLElement)
                    }

                    return { date, data }
                })

                let firstMappedDate: IDateItem = null

                const maxIndex = calendarDates.length - 1
                calendarDates.forEach((dt, i) => {

                    if (firstDataSet === false) {
                        const originallyDisabled = dt.ref.classList.contains('invalid')
                        dt.originallyDisabled = originallyDisabled
                    }

                    if (dt.data) {
                        dt.ref.children[0].removeChild(dt.data)
                        dt.data = null
                        dt.ref.classList.remove('has-data')
                    }

                    if (!dt.originallyDisabled) {
                        dt.ref.classList.remove('invalid')
                        dt.ref.classList.remove('data-invalid')
                    }

                    const dateDate = normalizedDatesData.find(x => isDatesEqual(dt.date, x.date))
                    if (!dateDate) {
                        if (disableDatesWithoutData) {
                            dt.ref.classList.add('invalid')
                            dt.ref.classList.add('data-invalid')
                        }
                        if (i === maxIndex) {
                            this.onDatesDataResolve(deselectDates, disableDatesWithoutData, firstMappedDate)
                            resolve()
                        }
                        return;
                    }

                    dt.data = dateDate.data
                    dt.ref.children[0].appendChild(dateDate.data)
                    dt.ref.classList.add('has-data')

                    if (firstMappedDate === null) {
                        firstMappedDate = dt
                    }

                    if (i === maxIndex) {
                        this.onDatesDataResolve(deselectDates, disableDatesWithoutData, firstMappedDate)
                        resolve()
                    }
                })
            }, 1);
        })
    }

    private onDatesDataResolve(deselectDates: boolean, disableDatesWithoutData: boolean, firstMappedDate: IDateItem) {
        if (deselectDates) {
            this.SetFromDate(null)
            this.SetToDate(null)
            this._state.selectingCount = 0
        }

        if (disableDatesWithoutData) {

            const monthRef = firstMappedDate.ref.parentElement/*tr*/.parentElement/*tbody*/.parentElement/*table*/
            const monthRefOffset = monthRef.offsetTop
            this._dom.datepickerContainer.scrollTop = monthRefOffset

            if (this.options.listMode) {
                this.SetListDatePageByDate(firstMappedDate.date)
            }
        }
    }

    protected ClearDatesData(): void {
        const { _dom } = this
        const { calendarDates } = _dom
        for (let i = 0; i < calendarDates.length; i++) {
            const dt = calendarDates[i]
            if (dt.data) {
                dt.ref.children[0].removeChild(dt.data)
                dt.data = null
                dt.ref.classList.remove('has-data')
            }

            if (!dt.originallyDisabled) {
                dt.ref.classList.remove('invalid')
                dt.ref.classList.remove('data-invalid')
            }
        }
    }
}