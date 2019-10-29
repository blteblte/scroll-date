
export interface Translation {
  month: string[]
  weekday: string[]
  selectDate: string
  selectDates: string
  selectThisDate: string
  selectTheseDates: string
}

export const translations = {

  /* English */
  en: {
    month: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    weekday: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ],
    selectDate: 'Select date',
    selectDates: 'Select dates',
    selectThisDate: 'Select this date',
    selectTheseDates: 'Select these dates'
  } as Translation,

   /* English Short */
  enShort: {
    month: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    weekday: [
        'Su',
        'Mo',
        'Tu',
        'We',
        'Th',
        'Fr',
        'Sa'
    ],
    selectDate: 'Select date',
    selectDates: 'Select dates',
    selectThisDate: 'Select this date',
    selectTheseDates: 'Select these dates'
  } as Translation,


  /* Hebrew */
  he: {
    month: [
        'ינואר',
        'פברואר',
        'מרץ',
        'אפריל',
        'מאי',
        'יוני',
        'יולי',
        'אוגוסט',
        'ספטמבר',
        'אוקטובר',
        'נובמבר',
        'דצמבר'
    ],
    weekday: [
        'יום ראשון',
        'יום שני',
        'יום שלישי',
        'יום רביעי',
        'יום חמישי',
        'יום שישי',
        'יום שבת'
    ],
    selectDate: 'בחר תאריך',
    selectDates: 'בחירת תאריכים',
    selectThisDate: 'בחר תאריך זה',
    selectTheseDates: 'בחר תאריכים אלה'
  } as Translation,

  /* Hebrew */
  heShort: {
    month: [
        'ינואר',
        'פברואר',
        'מרץ',
        'אפריל',
        'מאי',
        'יוני',
        'יולי',
        'אוגוסט',
        'ספטמבר',
        'אוקטובר',
        'נובמבר',
        'דצמבר'
    ],
    weekday: [
        'א\'',
        'ב\'',
        'ג\'',
        'ד\'',
        'ה\'',
        'ו\'',
        'ש\''
    ],
    selectDate: 'בחר תאריך',
    selectDates: 'בחירת תאריכים',
    selectThisDate: 'בחר תאריך זה',
    selectTheseDates: 'בחר תאריכים אלה'
  } as Translation,

  lv: {
    month: [
      'Janvāris',
      'Februāris',
      'Marts',
      'Aprīlis',
      'Maijs',
      'Jūnijs',
      'Jūlijs',
      'Augusts',
      'Septembris',
      'Oktobris',
      'Novembris',
      'Decembris'
    ],
    weekday: [
      'P',
      'O',
      'T',
      'C',
      'P',
      'Se',
      'Sv'
    ],
    selectDate: 'Izvēlies datumu',
    selectDates: 'Izvēlies datumus',
    selectThisDate: 'Pieņemt izvēlēto datumu',
    selectTheseDates: 'Pieņemt izvēlētos datumus'
  } as Translation,

  lvShort: {
    month: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mai',
      'Jun',
      'Jūl',
      'Aug',
      'Sep',
      'Okt',
      'Nov',
      'Dec'
    ],
    weekday: [
      'P',
      'O',
      'T',
      'C',
      'P',
      'S',
      'S'
    ],
    selectDate: 'Izvēlies datumu',
    selectDates: 'Izvēlies datumus',
    selectThisDate: 'Pieņemt izvēlēto datumu',
    selectTheseDates: 'Pieņemt izvēlētos datumus'
  } as Translation

}
