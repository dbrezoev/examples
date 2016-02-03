import {inject, customAttribute, bindable, noView} from 'aurelia-framework';

@noView()
@customAttribute('popover')
@inject(Element)
export class Popover {
  @bindable title;
  @bindable content;
  @bindable placement;
  @bindable disabled = false;

  constructor(element) {
    this.element = element;
    this.placement = 'auto';
  }

  detached() {
    this.$element.popover('dispose');
  }

  bind() {
    this.$element = $(this.element);

    if(this.disabled){
      return;
    }

    this.checkContent();
    this.checkPlacement();

    this.$element.popover(this._getOptions());
  }

  _getOptions() {
    return {
      content: this.content,
      title: this.title,
      placement: this.placement,
      trigger: 'hover',
      container: 'body',
      html: true
    };
  }

  _reinit() {
    if(this.disabled){
      return;
    }

    this.$element.popover('dispose');
    this.$element.popover(this._getOptions());
  }

  contentChanged(newValue, oldValue) {
    this._reinit();
  }

  titleChanged(newValue, oldValue) {
    this._reinit();
  }

  placementChanged(newValue, oldValue) {
    this._reinit();
  }

  checkContent() {
    if (!this.content) {
      throw new Error('Invalid value for popover content: ' + this.content);
    }
  }

  checkPlacement() {
    switch (this.placement) {
    case 'top':
    case 'bottom':
    case 'left':
    case 'right':
    case 'auto':
      break;
    default:
      throw new Error('Invalid value for popover placement: ' + this.placement);
    }
  }
}
