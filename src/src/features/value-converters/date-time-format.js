import moment from 'moment';

export class DateTimeFormatValueConverter {
  toView(value, format) {
    if (format) {
      return moment(value).format(format);
    }
    return moment(value).format('LLL');
  }
}
