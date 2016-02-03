import moment from 'moment';

export class ShortDateTimeFormatValueConverter {
  toView(value, format) {
    if (format) {
      return moment(value).format(format);
    }
    return moment(value).format('DD.MM.YYYY h:mm:ss');
  }
}
