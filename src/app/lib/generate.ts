import { translations } from '../translations';

function calendar(month, y, lang): Promise<string> {
    return new Promise((resolve) => {
        //Variables to be used later.  Place holders right now.
        var padding = "";
        var totalFeb: any = "";
        var i = 1;
        //var testing = "";

        var real = new Date();
        var realMonth = real.getMonth();
        var realDay = real.getDate();
        var realYear = real.getFullYear();

        var current = new Date(y, realMonth, realDay);
        var cmonth = current.getMonth();
        var day = current.getDate();
        var year = current.getFullYear();
        var tempMonth = month + 1; //+1; //Used to match up the current month with the correct start date.
        //var prevMonth = month - 1;

        //Determing if Feb has 28 or 29 days in it.
        if (month == 1) {
            if ((year % 100 !== 0) && (year % 4 === 0) || (year % 400 === 0)) {
                totalFeb = 29;
            } else {
                totalFeb = 28;
            }
        }

        //////////////////////////////////////////
        // Setting up arrays for the name of    //
        // the	months, days, and the number of	//
        // days in the month.                   //
        //////////////////////////////////////////

        var monthNames = translations[lang].month;
        var dayNames = translations[lang].weekday;
        var totalDays = ["31", "" + totalFeb + "", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];

        //////////////////////////////////////////
        // Temp values to get the number of days//
        // in current month, and previous month.//
        // Also getting the day of the week.	//
        //////////////////////////////////////////

        var tempDate = new Date(`${year}-01-${tempMonth < 10 ? '0' + tempMonth : tempMonth}`);
        var tempweekday = tempDate.getDay();
        var tempweekday2 = tempweekday;
        var dayAmount: any = totalDays[month];
        // var preAmount = totalDays[prevMonth] - tempweekday + 1;

        //////////////////////////////////////////////////
        // After getting the first day of the week for	//
        // the month, padding the other days for that	//
        // week with the previous months days.  IE, if	//
        // the first day of the week is on a Thursday,	//
        // then this fills in Sun - Wed with the last	//
        // months dates, counting down from the last	//
        // day on Wed, until Sunday.                    //
        //////////////////////////////////////////////////

        while (tempweekday > 0) {
            padding += "<td class='premonth'></td>";
            //preAmount++;
            tempweekday--;
        }
        //////////////////////////////////////////////////
        // Filling in the calendar with the current     //
        // month days in the correct location along.    //
        //////////////////////////////////////////////////

        while (i <= dayAmount) {

            //////////////////////////////////////////
            // Determining when to start a new row	//
            //////////////////////////////////////////

            if (tempweekday2 > 6) {
                tempweekday2 = 0;
                padding += "</tr><tr>";
            }

            //////////////////////////////////////////////////////////////////////////////////////////////////
            // checking to see if i is equal to the current day, if so then we are making the color of //
            //that cell a different color using CSS. Also adding a rollover effect to highlight the  //
            //day the user rolls over. This loop creates the acutal calendar that is displayed.		//
            //////////////////////////////////////////////////////////////////////////////////////////////////

            var timestamp = +new Date(y, month, i);

            if (i == day && month == cmonth && y === realYear) {
                padding += "<td data-timestamp='" + timestamp + "' class='currentday'><div>" + i + "</div></td>";
            } else {
                padding += "<td data-timestamp='" + timestamp + "' class='currentmonth'><div>" + i + "</div></td>";

            }

            tempweekday2++;
            i++;
        }


        /////////////////////////////////////////
        // Ouptputing the calendar onto the	//
        // site.  Also, putting in the month	//
        // name and days of the week.		//
        /////////////////////////////////////////

        var calendarTable = "<table class='calendar'> <tr class='currentmonth'><th colspan='7'>" + monthNames[month] + " " + year + "</th></tr>";
        calendarTable += `<tr class='weekdays'>  <td>${dayNames[0]}</td>  <td>${dayNames[1]}</td> <td>${dayNames[2]}</td> <td>${dayNames[3]}</td> <td>${dayNames[4]}</td> <td>${dayNames[5]}</td> <td>${dayNames[6]}</td> </tr>`;
        calendarTable += "<tr>";
        calendarTable += padding;
        calendarTable += "</tr></table>";
        return resolve(calendarTable);
    })
}

export async function generateCalendarHTML(startDate: Date, countOfMonths: number = 12, lang) {
    var html = ''
    var currentDate = startDate
    /* escape any edge cases */
    var tmpDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 5);
    for (let i = 0; i < countOfMonths; i++) {
        html += await calendar(tmpDate.getMonth(), tmpDate.getFullYear(), lang)
        tmpDate.setMonth(tmpDate.getMonth() + 1)
    }
    return html;
}
