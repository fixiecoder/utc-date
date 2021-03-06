// JS PERF https://jsperf.com/my-date-vs-js-date/1

/** prefixUnitZero
 * add a 0 to a number below 10 (ie, a unit)
 * @param val: number
 * @return string
 */
function prefixUnitZero(val) {
  let newVal = val;
  if(val < 0) {
    newVal = val / -1;
  }
  newVal = newVal < 10 ? `0${newVal}` : newVal;
  if(val < 0) {
    newVal = `-${newVal}`;
  }
  return newVal;
}


function getOrdinal(number) {
  const numberAsString = number.toString();
  const lastDigit = numberAsString.charAt(numberAsString.length - 1);
  switch(lastDigit) {
    case '1':
      return `${number}st`;
    case '2':
      return `${number}nd`;
    case '3':
      return `${number}rd`;
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '0':
      return `${number}th`;
    default:
      return '';
  }
}

function getMonth(dayOfYear, isLeapYear) {
  const leapYearAddition = isLeapYear ? 1 : 0;
  if(dayOfYear <= 31) {
    return MONTHS_INDEX[0]; // jan
  } else if(dayOfYear > 31 && dayOfYear <= 59 + leapYearAddition) {
    return MONTHS_INDEX[1]; // feb
  } else if(dayOfYear > 59 + leapYearAddition && dayOfYear <= 90 + leapYearAddition) {
    return MONTHS_INDEX[2]; // mar
  } else if(dayOfYear > 90 + leapYearAddition && dayOfYear <= 120 + leapYearAddition) {
    return MONTHS_INDEX[3]; // apr
  } else if(dayOfYear > 120 + leapYearAddition && dayOfYear <= 151 + leapYearAddition) {
    return MONTHS_INDEX[4]; // may
  } else if(dayOfYear > 151 + leapYearAddition && dayOfYear <= 181 + leapYearAddition) {
    return MONTHS_INDEX[5]; // jun
  } else if(dayOfYear > 181 + leapYearAddition && dayOfYear <= 212 + leapYearAddition) {
    return MONTHS_INDEX[6]; // jul
  } else if(dayOfYear > 212 + leapYearAddition && dayOfYear <= 243 + leapYearAddition) {
    return MONTHS_INDEX[7]; // aug
  } else if(dayOfYear > 243 + leapYearAddition && dayOfYear <= 273 + leapYearAddition) {
    return MONTHS_INDEX[8]; // sept
  } else if(dayOfYear > 273 + leapYearAddition && dayOfYear <= 304 + leapYearAddition) {
    return MONTHS_INDEX[9]; // oct
  } else if(dayOfYear > 304 + leapYearAddition && dayOfYear <= 334 + leapYearAddition) {
    return MONTHS_INDEX[10]; // nov
  } else if(dayOfYear > 334 + leapYearAddition && dayOfYear <= 365 + leapYearAddition) {
    return MONTHS_INDEX[11]; // nov
  } else {
    return MONTHS_INDEX[0];
  }
}


/*

  YYYY      2014  4 or 2 digit year
  YY        14  2 digit year
  M MM      1..12 Month number
  MMM MMMM  Jan..December Month name in locale set by moment.locale()
  ddd dddd  Mon...Sunday  Day name in locale set by
  D DD      1..31 Day of month
  Do        1st..31st Day of month with ordinal
  X         1410715640.579  Unix timestamp
  x         1410715640579 Unix ms timestamp
  H HH      0..23 Hours (24 hour time)
  h hh      1..12 Hours (12 hour time used with a A.)
  m mm      0..59 Minutes
  s ss      0..59 Seconds

  TODO:
  a A       am pm Post or ante meridiem (Note the one character a p are also considered valid)
  S SS SSS  0..999  Fractional seconds
  Z ZZ      +12:00  Offset from UTC as +-HH:mm, +-HHmm, or Z

*/
function format(formatString = '') {
  const splitCharsRX = /[\/\s:-]/g;
  const parts = formatString.split(/[\/\s:-]/);
  const splitChars = formatString.match(splitCharsRX);

  let output = '';

  for(let i = 0; i < parts.length; i += 1) {
    let partReplaceString = '';
    switch(parts[i]) {
      case 's':
        partReplaceString = this._jsDate.getSeconds();
        break;
      case 'ss':
        partReplaceString = prefixUnitZero(this._jsDate.getSeconds());
        break;
      case 'm':
        partReplaceString = this._jsDate.getMinutes();
        break;
      case 'mm':
        partReplaceString = prefixUnitZero(this._jsDate.getMinutes());
        break;
      case 'H':
        partReplaceString = this._jsDate.getHours();
        break;
      case 'HH':
        partReplaceString = prefixUnitZero(this._jsDate.getHours());
        break;
      case 'h': {
        const hours = this._jsDate.getHours();
        partReplaceString = hours > 12 ? hours - 12 : hours;
        break;
      }
      case 'hh': {
        const hours = this._jsDate.getHours();
        partReplaceString = prefixUnitZero(hours > 12 ? hours - 12 : hours);
        break;
      }
      case 'x':
        partReplaceString = this._jsDate.getTime();
        break;
      case 'X':
        partReplaceString = this._jsDate.getTime() / 1000;
        break;
      case 'dddd':
        partReplaceString = this.getDayOfWeek(this._TYPES.LONG);
        break;
      case 'ddd':
        partReplaceString = this.getDayOfWeek(this._TYPES.SHORT);
        break;
      case 'Do':
        partReplaceString = getOrdinal(this.dayOfMonth());
        break;
      case 'D':
        partReplaceString = this.dayOfMonth();
        break;
      case 'DD':
        partReplaceString = prefixUnitZero(this.dayOfMonth());
        break;
      case 'M':
        partReplaceString = this.getMonthNumber();
        break;
      case 'MM':
        partReplaceString = prefixUnitZero(this.getMonthNumber());
        break;
      case 'MMM':
        partReplaceString = this.getMonthName(this._TYPES.SHORT);
        break;
      case 'MMMM':
        partReplaceString = this.getMonthName(this._TYPES.LONG);
        break;
      case 'YY':
        partReplaceString = this.getYear(this._TYPES.SHORT);
        break;
      case 'YYYY':
        partReplaceString = this.getYear();
        break;
      default:
        partReplaceString = parts[i];
        break;
    }
    output += `${partReplaceString}${splitChars[i] || ''}`;
  }

  return output;
}

function getMonthFromNumber(monthNumber) {
  if(monthNumber < 0) {
    throw new Error('months are not zero indexed, please use the correct month number e.g. for January use 1');
  }
  return MONTHS_INDEX[monthNumber - 1];
}

function caclulateEpochMS(dateArray = []) {
  let epochMs = 0;
  let isLeapYear = false;
  if(dateArray[0]) {
    const mod = dateArray[0] % 4;
    isLeapYear = !mod;
    epochMs = ((dateArray[0] - 1970) * DAY_MS * 365.25) + HALF_DAY;
    if(mod) {
      epochMs -= mod * QUARTER_DAY;
    } else {
      epochMs -= DAY_MS;
    }

  } else {
    // if we don't have any element
    return this.now();
  }

  if(dateArray[1]) {
    const leapYearAddition = isLeapYear && dateArray[1] > 1 ? 1 : 0;
    const month = getMonthFromNumber(dateArray[1]);
    epochMs += DAY_MS * (month.dayOfYearIndex + leapYearAddition);
  }

  if(dateArray[2]) {
    epochMs += (dateArray[2] - 1) * DAY_MS;
  }

  if(dateArray[3]) {
    epochMs += dateArray[3] * HOUR_MS;
  }

  if(dateArray[4]) {
    epochMs += dateArray[4] * MINUTE_MS;
  }

  return epochMs;
}

const MONTHS_INDEX = [
  { long: 'January', short: 'Jan', daysInMonth: 31, dayOfYearIndex: 0 },
  { long: 'February', short: 'Feb', daysInMonth: 28, dayOfYearIndex: 31 },
  { long: 'March', short: 'Mar', daysInMonth: 31, dayOfYearIndex: 59 },
  { long: 'April', short: 'Apr', daysInMonth: 30, dayOfYearIndex: 90 },
  { long: 'May', short: 'May', daysInMonth: 31, dayOfYearIndex: 120 },
  { long: 'June', short: 'Jun', daysInMonth: 30, dayOfYearIndex: 151 },
  { long: 'July', short: 'Jul', daysInMonth: 31, dayOfYearIndex: 181 },
  { long: 'August', short: 'Aug', daysInMonth: 31, dayOfYearIndex: 212 },
  { long: 'September', short: 'Sep', daysInMonth: 30, dayOfYearIndex: 243 },
  { long: 'October', short: 'Oct', daysInMonth: 31, dayOfYearIndex: 273 },
  { long: 'November', short: 'Nov', daysInMonth: 30, dayOfYearIndex: 304 },
  { long: 'December', short: 'Dec', daysInMonth: 31, dayOfYearIndex: 334 },
];

const DAYS_OF_WEEK = [
  { long: 'Sunday', short: 'Sun', day: 7 },
  { long: 'Monday', short: 'Mon', day: 1 },
  { long: 'Tuesday', short: 'Tue', day: 2 },
  { long: 'Wednesday', short: 'Wed', day: 3 },
  { long: 'Thursday', short: 'Thu', day: 4 },
  { long: 'Friday', short: 'Fri', day: 5 },
  { long: 'Saturday', short: 'Sat', day: 6 },
];

const DAYS_OF_WEEK_2 = ['THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY'];

const MINUTE_MS = 60000;
const HOUR_MS = 3600000;
const DAY_MS = 86400000;
const HALF_DAY = 43200000;
const QUARTER_DAY = 21600000;
const YEAR_MS = 31557600000;


class UTCDate {
  constructor(_date) {
    this._monthsIndex = MONTHS_INDEX;
    this._daysOfWeek = DAYS_OF_WEEK;
    this._originalDateValue = _date;
    if(!_date) {
      this.epochMs = this.now();
    } else if(Array.isArray(_date)) {
      this.epochMs = caclulateEpochMS(_date);
    } else if(typeof _date === 'number') {
      this.epochMs = _date;
    }
    this.isLeapYear = '';
    this._TYPES = { LONG: 'long', SHORT: 'short', MID: 'mid' };
  }

  getEpochMS() {
    return this.epochMs;
  }

  now() {
    return Date.now ? Date.now() : +(new Date());
  }

  _getRemainingMs() {
    return this.epochMs % YEAR_MS;
  }

  getYear() {
    return Math.floor(1970 + Math.floor(this.epochMs / YEAR_MS));
  }

  getDayOfYear() {
    return Math.floor(this._getRemainingMs() / DAY_MS);
  }

  getMonth() {
    return getMonth(this.getDayOfYear(), this.isLeapYear);
  }

  getDayOfWeek() {
    return DAYS_OF_WEEK_2[Math.floor(this.epochMs / DAY_MS) % 7];
  }
}

const date = new UTCDate([2018, 2, 2, 10, 5]);
console.log('me', date.getEpochMS());
const date2 = new Date(Date.UTC(2018, 1, 2, 10, 5, 0));
console.log('js', date2.getTime());