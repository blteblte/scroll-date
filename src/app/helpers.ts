// export function getDateElalSearchFormat(date: Date): string {
//     const dd = date.getDate()
//     const mIx = date.getMonth()
//     const yyyy = date.getFullYear()
//     const mArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Dec']

//     return `${dd}/${mArr[mIx]}/${yyyy}`
// }

export function parseDate(dateStr: string) {
    try {
        return new Date(dateStr)
    } catch (e) {
        return new Date()
    }
}

export function getDateISOFormat(date: Date): string {
  const dd = date.getDate()
  const mm = date.getMonth() + 1
  const yyyy = date.getFullYear()

  return `${yyyy}-${mm < 10 ? `0${mm}` : mm}-${dd < 10 ? `0${dd}` : dd}`
}

export function isDatesEqual(date1: Date | string, date2: Date | string) {
  if (date1 === undefined) { return false }
  if (date2 === undefined) { return false }

  let date1Type: 'string' | 'date'
  let date2Type: 'string' | 'date'

  if (typeof date1 === 'string' || date1 instanceof String) {
      date1Type = 'string'
  } else {
      date1Type = 'date'
  }

  if (typeof date2 === 'string' || date2 instanceof String) {
      date2Type = 'string'
  } else {
      date2Type = 'date'
  }

  if (date1Type === 'date' && date2Type === 'date') {
      return getDateISOFormat(date1 as Date) === getDateISOFormat(date2 as Date)
  } else if (date1Type === 'date' && date2Type === 'string') {
      return getDateISOFormat(date1 as Date) === date2
  } else if (date1Type === 'string' && date2Type === 'date') {
      return date1 === getDateISOFormat(date2 as Date)
  } else {
      return date1 === date2
  }
}

export function camelCaseToDash(myStr) {
    return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

export function getDatePickerPlaceholderDate(date: Date) {
    const dd = date.getDate()
    const mm = date.getMonth() + 1
    const yyyy = date.getFullYear()

    return `${dd < 10 ? `0${dd}` : dd}/${mm < 10 ? `0${mm}` : mm}/${yyyy}`
}