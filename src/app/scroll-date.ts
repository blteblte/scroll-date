import './scroll-date.scss';


/**
 * TODO:
 * REFACTOR!!!
 */


import { Options, defaultOptions } from './options';
import { camelCaseToDash, getDatePickerPlaceholderDate, parseDate, isDatesEqual, getDateISOFormat } from './helpers';
import { generateCalendarHTML } from './lib/generate';
import { translations } from './translations';

interface IDateItem {
  date: Date
  ref: HTMLElement
}

interface Targets {
  dateFromInput: HTMLInputElement
  dateToInput: HTMLInputElement
}

interface Dom {
  datepickerWrapper: HTMLElement
  datepickerContainer: HTMLElement
  container: Element
  datepickerTitle: HTMLElement
  datepickerSubmit: HTMLElement
  uiFromDate: HTMLElement
  uiToDate: HTMLElement
  selectedMonthRef: HTMLElement
  calendarDates: IDateItem[]
}

interface State {
  singleDateMode: boolean
  isRendered: boolean
  selectingCount: number
  startDate: Date | string
  zeroDate: Date
  date1: Date
  date2: Date
  cachedDate2: Date;
}

export class ScrollDate {

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
    calendarDates: null
  }

  private _state: State = {
    singleDateMode: false,
    isRendered: false,
    selectingCount: 0,
    startDate: null,
    zeroDate: null,
    date1: null,
    date2: null,
    cachedDate2: null
  }

  public constructor(
      private host: HTMLElement
    , userOptions: Options = ({} as any)
  ) {
    /* set default */
    const scrollDateOptions = defaultOptions

    /* get from tag attributes */
    Object.keys(scrollDateOptions).forEach((key) => {
      const attributeName = camelCaseToDash(key)
      const attributeValue = host.getAttribute(attributeName)
      if (attributeValue) {
        scrollDateOptions[key] = attributeValue
      }
    })

    this.options = { ...scrollDateOptions, ...userOptions}

    if (typeof this.options.from === 'string') {
      this._targets.dateFromInput = document.querySelector(this.options.from)
    } else {
      this._targets.dateFromInput = this.options.from
    }

    if (this.options.to) {
      if (typeof this.options.to === 'string') {
        this._targets.dateToInput = document.querySelector(this.options.to)
      } else {
        this._targets.dateToInput = this.options.to
      }
    }

    if (!this._targets.dateToInput) {
      this._state.singleDateMode = true
    }

    this._dom.datepickerWrapper = document.createElement('div')
    this._dom.datepickerWrapper.classList.add('scroll-date')

    this._state.zeroDate = new Date()
    this._state.zeroDate.setHours(0, 0, 0, 0)

    /* dafault date values */
    this._state.date1 = this.addDays(this._state.zeroDate, 3)
    this._state.date2 = this.addDays(this._state.zeroDate, 7)

    /* set startdate */
    this._state.startDate = this._state.zeroDate

    if (this._state.date1 > this._state.date2) {
        this._state.date2 = this._state.date1
    }

    this.apply(this._state.date1, this._state.date2)

    this._targets.dateFromInput.addEventListener('focus', () => this.Show())

    if (this._targets.dateToInput) {
      this._targets.dateToInput.addEventListener('focus', () => this.Show())
    }

    /* set reference to this class on the element it self */
    host['ScrollDate'] = this

    this.Render()
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
      }
      this._firstSelectedDate = dt
      this._dom.selectedMonthRef = dt.ref.parentElement/*tr*/.parentElement/*tbody*/.parentElement/*table*/
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
      }
      this._secondSelectedDate = dt
      this.updateCalendarConnectDates()
  }

  public SetStartDate(d: string | Date) {
      if (typeof d === 'string' || d instanceof String) {
          d = parseDate(d as string)
      }

      this._state.startDate = d
      this.updateCalendarStartDate()
      if (this._state.startDate > this._state.date1) {
          this.SetFromDate(d as Date)
          this.SetToDate(d as Date)
      }
      this._state.selectingCount = 0
  }

  public ClearStartDate() {
      this._state.startDate = this._state.zeroDate
      this.updateCalendarStartDate()
      this._state.selectingCount = 0
  }

  public Unbind() {
      if (this._state.isRendered) {
          this._dom.container.removeChild(this._dom.datepickerWrapper)
          this._state.selectingCount = 0
      }
  }

  public GetFromDate() {
      return this._state.date1
  }

  public GetToDate() {
      return this._state.date2
  }

  public SetFromDate(d: Date) {
      //console.log('set from date', d.getDate())
      this._state.date1 = d
      this.updateCalendarSelectFirstDate(d)
      this.apply(this._state.date1, this._state.date2)
      this._state.selectingCount = 0
  }

  public SetToDate(d: Date) {
      //console.log('set to date', d.getDate())
      this._state.date2 = d
      this.updateCalendarSelectSecondDate(d)
      this.apply(this._state.date1, this._state.date2)
      this._state.selectingCount = 0
  }

  public Visible() {
      return this._dom.datepickerWrapper.classList.contains('visible')
  }

  public Hide() {
      this._dom.datepickerWrapper.classList.contains('visible') && this._dom.datepickerWrapper.classList.remove('visible')
      document.body.style.overflowY = 'auto';
  }

  public Show() {
      this.SetFromDate(this._state.date1)
      this.SetToDate(this._state.date2)
      !this._dom.datepickerWrapper.classList.contains('visible') && this._dom.datepickerWrapper.classList.add('visible')
      document.body.style.overflowY = 'hidden';
      if (this._dom.selectedMonthRef) {
          const monthRefOffset = this._dom.selectedMonthRef.offsetTop
          this._dom.datepickerContainer.scrollTo(0, monthRefOffset)
      }
  }

  public async Render() {

      if (this.options.rtl && !this._dom.datepickerWrapper.classList.contains('rtl')) {
          this._dom.datepickerWrapper.classList.add('rtl')
      }

      await this.render(this.options.startDate, this.options.monthCount, this.host, true, this.options.rtl)
      await this.bind()

      this.SetFromDate(this._state.date1)
      this.SetToDate(this._state.date2)

      if (this._state.singleDateMode) {
        this.setSingleDateMode()
      }
  }

    private async render(
          drawingStartDate: Date
        , monthCountToDraw: number
        , container: Element
        , clearContainer: boolean = true
        , rtl: boolean = false
    ) {
        const calendarHtml = await generateCalendarHTML(drawingStartDate, monthCountToDraw, this.options.lang)
        if (clearContainer) {
            container.innerHTML = ''
        }

        /* header */
        const headerContainer = document.createElement('div')
        headerContainer.className = 'scroll-date__header'
        this._dom.datepickerTitle = document.createElement('div')
        this._dom.datepickerTitle.className = 'scroll-date__header--title'
        this._dom.datepickerTitle.innerHTML = translations[this.options.lang].selectDates
        const closeButton = document.createElement('span')
        closeButton.className = 'scroll-date__header--close'
        closeButton.addEventListener('click', () => this.Hide())

        headerContainer.appendChild(this._dom.datepickerTitle)
        headerContainer.appendChild(closeButton)

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
        this._dom.datepickerSubmit.innerHTML = translations[this.options.lang].selectTheseDates
        this._dom.datepickerSubmit.addEventListener('click', () => {
            this._state.date1 = this.firstSelectedDate.date
            this._state.date2 = (this.secondSelectedDate || this.firstSelectedDate).date
            this.apply(this._state.date1, this._state.date2)
            this.Hide()
        })
        uiSubmitContainer.appendChild(this._dom.datepickerSubmit)
        datepickerUIContainer.appendChild(uiDatesContainer)
        datepickerUIContainer.appendChild(uiSubmitContainer)

        /* overflow */
        const overflow = document.createElement('div')
        overflow.className = 'scroll-date__overflow'
        this._dom.datepickerWrapper.appendChild(overflow)
        overflow.addEventListener('click', () => this.Hide())

        this._dom.datepickerWrapper.appendChild(headerContainer)
        this._dom.datepickerWrapper.appendChild(this._dom.datepickerContainer)
        this._dom.datepickerWrapper.appendChild(datepickerUIContainer)

        container.appendChild(this._dom.datepickerWrapper)
        this._dom.container = container
        this._state.isRendered = true
    }

    private async bind() {
      const tds = Array.prototype.slice.call(
          this._dom.datepickerWrapper.querySelectorAll('td[data-timestamp]')
      ) as HTMLElement[]

      this._dom.calendarDates = tds.map((td) => {
          const tdDate = new Date(parseInt(td.getAttribute('data-timestamp')))
          tdDate.setHours(0, 0, 0, 0)
          return {
              date: tdDate,
              ref: td
          } as IDateItem
      })

      this.updateCalendarStartDate()
      this.bindCalendarClickListeners()
  }

  private setSingleDateMode() {
      this._dom.datepickerTitle.innerHTML = translations[this.options.lang].selectDate
      this._dom.datepickerSubmit.innerHTML = translations[this.options.lang].selectThisDate

      if (!this._state.cachedDate2) {
          this._state.cachedDate2 = this._state.date2
      }
      this.SetToDate(this._state.date1)
      !this._dom.datepickerWrapper.classList.contains('single-date') && this._dom.datepickerWrapper.classList.add('single-date')
  }

  // private unsetSingleDateMode() {
  //     this.datepickerTitle.innerHTML = translations[this.options.lang].selectDates
  //     this.datepickerSubmit.innerHTML = translations[this.options.lang].selectTheseDates

  //     if (this.cachedDate2) {
  //         if (this.cachedDate2 > this.date1) {
  //             this.SetToDate(this.cachedDate2)
  //         }
  //         this.cachedDate2 = undefined
  //     }
  //     this.datepickerWrapper.classList.contains('single-date') && this.datepickerWrapper.classList.remove('single-date')
  // }

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
  }

  private updateCalendarSelectFirstDate(d: Date) {
      const dt = this._dom.calendarDates.find((x) => isDatesEqual(x.date, d))
      if (dt) {
          this.firstSelectedDate = dt
      }
  }

  private updateCalendarSelectSecondDate(d: Date) {
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
      })
  }

  /**
   * Draw/remove 'connect' class between selected dates
   */
  private updateCalendarConnectDates() {
      let isFoundFirst = false
      let isFoundSecond = false
      if (!this.secondSelectedDate) {
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
              if (isFoundFirst && !isFoundSecond) {
                  !dt.ref.classList.contains('connect') && dt.ref.classList.add('connect')
              } else {
                  dt.ref.classList.contains('connect') && dt.ref.classList.remove('connect')
              }
              if (!isFoundSecond) {
                  isFoundSecond = dt.ref.classList.contains('second')
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
              } else if (this._state.selectingCount === 2) {
                  this._state.selectingCount = 0
              }
          })

      })
  }

  private addDays(dt, days) {
      var date = new Date(dt.valueOf());
      date.setDate(date.getDate() + days);
      return date;
  }

}