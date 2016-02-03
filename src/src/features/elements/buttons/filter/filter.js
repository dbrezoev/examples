import {inject, customElement, bindable} from 'aurelia-framework';

@customElement('filter-button')
@inject(Element)
export class FilterButton {
  @bindable disabled = false;
  @bindable onClick = null;
  @bindable isActive;
  name = '';
  type = 'btn-default';

  constructor(element) {
    this.element = element;
  }

  bind() {
    if (this.isActive) {
      this._activateFilter();
    } else {
      this._deactivateFilter();
    }
  }

  buttonClicked() {
    if (typeof this.onClick === 'function') {
      this.onClick();
    }

    this._toggleFilter();
  }

  _toggleFilter() {
    if (this.isActive) {
      this._deactivateFilter();
    } else {
      this._activateFilter();
    }
  }

  _activateFilter() {
    this.isActive = true;
    this.name = 'Скрий филтър';
    this.type = 'btn-success';
  }

  _deactivateFilter() {
    this.isActive = false;
    this.name = 'Покажи филтър';
    this.type = 'btn-default';
  }
}

