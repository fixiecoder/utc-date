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

module.exports = {
  format,
};
