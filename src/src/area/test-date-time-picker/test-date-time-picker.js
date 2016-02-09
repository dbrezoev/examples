import moment from 'moment';
import {Timespan} from 'utils';

export class TestDateTimePicker {
  constructor() {
    this.clearDatesUndefined();
    this.readonly = true;
    this.disabled = true;
    this.increment = 0;
    window.test = this;
  }

  toggleReadonly() {
    this.readonly = !this.readonly;
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
  }

  changeDates() {
    this.date = moment().add(this.increment, 'days');
    this.datetime = moment().add(this.increment, 'days').add(this.increment, 'hours');
    this.time = new Timespan(moment().add(this.increment, 'hours'));
    this.increment++;
  }

  clearDatesNull() {
    this.date = null;
    this.datetime = null;
    this.time = null;
    this.increment = 0;
  }

  clearDatesUndefined() {
    this.date = undefined;
    this.datetime = undefined;
    this.time = undefined;
    this.increment = 0;
  }
}
