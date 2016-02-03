import {inject, customElement, bindable, bindingMode} from 'aurelia-framework';
import $ from 'jquery';
import 'Eonasdan/bootstrap-datetimepicker';
import moment from 'moment';

@customElement('datepicker')
@inject(Element)
export class Datepicker {
  @bindable({defaultBindingMode: bindingMode.twoWay}) value = null;
  @bindable options = null;
  @bindable disabled = false;

  constructor(element) {
    this.element = element;
  }

  bind() {
    let self = this;
    const defaultOpts = {
      collapse: false,
      useCurrent: false,
      calendarWeeks: true,
      debug: false,
      locale: moment.locale(),
      format: 'L',
      icons: {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-crosshairs',
        clear: 'fa fa-trash',
        close: 'fa fa-times'
      }
    };

    let div = this.element.firstElementChild;
    this.$element = $(div);

    this.options = this.options || {};
    if (this.options.format !== undefined) {
      delete this.options.format;
    }
    this.options = $.extend({}, defaultOpts, this.options);

    this.datepicker = this.$element.datetimepicker(this.options);

    this.datepicker.on('dp.change', (event) => {
      this.value = event.date;
      //Find better way to invoke observable before function!!!
      setTimeout(function() {
        self.element.dispatchEvent(new Event('change'));
      });
    });

    this.valueChanged(this.value);
  }

  valueChanged(newValue, oldValue) {
    if (newValue === null || newValue === undefined || newValue === false || newValue.isValid() !== true) {
      let input = this.element.firstElementChild.firstElementChild;
      input.value = '';
      return;
    }

    if (newValue.isSame(oldValue)) {
      return;
    }

    this.$element.data('DateTimePicker').date(newValue);
  }
}
