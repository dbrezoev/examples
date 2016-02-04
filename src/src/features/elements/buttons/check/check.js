import {inject, customElement, bindable} from 'aurelia-framework';

@customElement('check-button')
@inject(Element)
export class CheckButton {
  @bindable disabled = false;
  @bindable onClick = null;
  @bindable isActive = false;
  @bindable name = '';

  icon = '';
  type = 'btn-default';

  constructor(element) {
    this.element = element;
  }

  bind() {
    if (this.isActive) {
      this._check();
    } else {
      this._uncheck();
    }
  }

  buttonClicked() {
    if (typeof this.onClick === 'function') {
      this.onClick();
    }

    this._toggle();
  }

  _toggle() {
    if (this.isActive) {
      this._uncheck();
    } else {
      this._check();
    }
  }

  _check() {
    this.isActive = true;
    this.icon = 'fa-check-square-o';
  }

  _uncheck() {
    this.isActive = false;
    this.icon = 'fa-square-o';
  }
}

