import { ScrollDate } from './scroll-date';

/* set global ref */
(window as any).ScrollDate = ScrollDate

/* auto-bind on ready */
function onLoad() {
  const autoBindDatePickers = Array.prototype.slice.call(
    document.querySelectorAll('scroll-date')
  ) as HTMLElement[]

  autoBindDatePickers.forEach((tag) => {
    const bindAttributeValue = tag.getAttribute('bind')
    const bind = bindAttributeValue !== 'false' && bindAttributeValue !== '0'
    if (bind) new ScrollDate(tag)
  })
}

document.addEventListener('DOMContentLoaded', onLoad)
