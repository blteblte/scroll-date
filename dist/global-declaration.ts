import { IScrollDate } from "./i-scroll-date";
import { Options } from "./models/Options";

export type ScrollDateType = (host: HTMLElement, userOptions?: Options, contextContainer?: Document | Element) => IScrollDate;

declare global {
  interface Window { ScrollDate: ScrollDateType; }
}