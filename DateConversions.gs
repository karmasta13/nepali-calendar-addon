/**
 * Converts Gregorian date to Bikram Sambat date
 */
function convertGregorianToBS(year, month, day) {
  var adDate = new Date(year, month - 1, day);
  var diffTime = adDate.getTime() - NepaliCalendar.REF_DATE_AD.getTime();
  var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  var bsYear = NepaliCalendar.REF_DATE_BS.year;
  var bsMonth = NepaliCalendar.REF_DATE_BS.month;
  var bsDay = NepaliCalendar.REF_DATE_BS.day;
  var remainingDays = diffDays;
  
  if (diffDays < 0) {
    return { 
      year: bsYear, 
      month: bsMonth, 
      day: bsDay, 
      monthName: NepaliCalendar.MONTHS[bsMonth - 1] 
    };
  }
  
  while (remainingDays > 0) {
    var daysInMonth = NepaliCalendar.CALENDAR_DATA[bsYear][bsMonth - 1];
    
    if (bsDay + remainingDays > daysInMonth) {
      remainingDays -= (daysInMonth - bsDay + 1);
      bsDay = 1;
      bsMonth++;
      
      if (bsMonth > 12) {
        bsYear++;
        bsMonth = 1;
        
        if (!NepaliCalendar.CALENDAR_DATA[bsYear]) {
          return { 
            year: bsYear, 
            month: bsMonth, 
            day: bsDay, 
            monthName: NepaliCalendar.MONTHS[bsMonth - 1],
            approximate: true 
          };
        }
      }
    } else {
      bsDay += remainingDays;
      remainingDays = 0;
    }
  }
  
  return { 
    year: bsYear, 
    month: bsMonth, 
    day: bsDay, 
    monthName: NepaliCalendar.MONTHS[bsMonth - 1]
  };
}

/**
 * Converts Bikram Sambat date to Gregorian date
 */
function convertBSToGregorian(bsYear, bsMonth, bsDay) {
  var refDate = new Date(NepaliCalendar.REF_DATE_AD);
  var diffDays = -1;
  
  for (var year = NepaliCalendar.REF_DATE_BS.year; year < bsYear; year++) {
    if (!NepaliCalendar.CALENDAR_DATA[year]) {
      return { 
        year: refDate.getFullYear(), 
        month: refDate.getMonth() + 1, 
        day: refDate.getDate() 
      };
    }
    
    for (var month = 0; month < 12; month++) {
      diffDays += NepaliCalendar.CALENDAR_DATA[year][month];
    }
  }
  
  for (var month = 0; month < bsMonth - 1; month++) {
    diffDays += NepaliCalendar.CALENDAR_DATA[bsYear][month];
  }
  
  diffDays += bsDay - NepaliCalendar.REF_DATE_BS.day;
  refDate.setDate(refDate.getDate() + diffDays);
  
  return { 
    year: refDate.getFullYear(), 
    month: refDate.getMonth() + 1,
    day: refDate.getDate() 
  };
}

/**
 * Gets current date in Nepali calendar
 */
function getCurrentNepaliDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  
  return convertGregorianToBS(year, month, day);
}

/**
 * Gets month data for calendar display
 */
function getMonthData(year, month) {
  Logger.log("getMonthData called with year=" + year + ", month=" + month);
  Logger.log("NepaliCalendar exists: " + (typeof NepaliCalendar !== 'undefined'));
  
  if (typeof NepaliCalendar !== 'undefined') {
    Logger.log("CALENDAR_DATA exists: " + (typeof NepaliCalendar.CALENDAR_DATA !== 'undefined'));
    Logger.log("Available years: " + Object.keys(NepaliCalendar.CALENDAR_DATA));
  }
  // Add validation
  if (!year || !month) {
    Logger.log("Invalid parameters: year=" + year + ", month=" + month);
    // Return default values to avoid crashing
    return {
      firstDayOfWeek: 0,
      daysInMonth: 30
    };
  }


  // Make sure year and month are numbers
  year = parseInt(year);
  month = parseInt(month);
  
  // Check if we have data for this year
  if (!NepaliCalendar.CALENDAR_DATA[year]) {
    Logger.log("No calendar data for year: " + year);
    // Use the closest year we have data for
    year = Object.keys(NepaliCalendar.CALENDAR_DATA)[0];
  }
  
  // Ensure month is between 1-12
  if (month < 1 || month > 12) {
    Logger.log("Invalid month: " + month);
    month = 1;
  }
  
  var firstDayAD = convertBSToGregorian(year, month, 1);
  var firstDate = new Date(firstDayAD.year, firstDayAD.month - 1, firstDayAD.day);
  var firstDayOfWeek = firstDate.getDay();
  var daysInMonth = NepaliCalendar.CALENDAR_DATA[year][month - 1];
  
  return {
    firstDayOfWeek: firstDayOfWeek,
    daysInMonth: daysInMonth
  };
}