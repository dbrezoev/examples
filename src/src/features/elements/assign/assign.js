import {inject, customElement, bindable, computedFrom, bindingMode} from 'aurelia-framework';
import {customElementHelper} from 'utils';

@customElement('assign')
@inject(Element)
export class Assign {
  @bindable({defaultBindingMode: bindingMode.twoWay}) leftItems;
  @bindable({defaultBindingMode: bindingMode.twoWay}) rightItems;
  @bindable leftHeading;
  @bindable rightHeading;

  constructor(element) {
    this.element = element;
    this.selectedItem;
  }

  @computedFrom('selectedItem')
  get moveRightDisabled() {
    let moveRightDisabled = this.leftItems.every(item => {
      return item !== this.selectedItem;
    });
    return moveRightDisabled;
  }

  @computedFrom('selectedItem')
  get moveLeftDisabled() {
    let moveLeftDisabled = this.rightItems.every(item => {
      return item !== this.selectedItem;
    });
    return moveLeftDisabled;
  }

  select(item) {
    this.selectedItem = item;

    customElementHelper.dispatchEvent(this.element, 'item-click', {
      item: this.selectedItem
    });
  }

  moveLeft() {
    let fromCollection = this.rightItems;
    let toCollection = this.leftItems;

    let item = this._remove(fromCollection, this.selectedItem);
    this._add(toCollection, item);

    customElementHelper.dispatchEvent(this.element, 'move-left-click', {
      item: this.selectedItem
    });

    this.selectedItem = undefined;
  }

  moveRight() {
    let fromCollection = this.leftItems;
    let toCollection = this.rightItems;

    let item = this._remove(fromCollection, this.selectedItem);
    this._add(toCollection, item);

    customElementHelper.dispatchEvent(this.element, 'move-right-click', {
      item: this.selectedItem
    });

    this.selectedItem = undefined;
  }

  moveAllLeft() {
    let allItems = this.leftItems.concat(this.rightItems);


    this.selectedItem = undefined;

    this.leftItems = allItems;
    this.rightItems = [];

    customElementHelper.dispatchEvent(this.element, 'move-all-left-click', {});
  }

  moveAllRight() {
    let allItems = this.leftItems.concat(this.rightItems);
    
    this.selectedItem = undefined;

    this.rightItems = allItems;
    this.leftItems = [];

    customElementHelper.dispatchEvent(this.element, 'move-all-right-click', {});
  }

  _add(toContainer, item) {
    toContainer.push(item);
  }

  _remove(fromContainer, item) {
    let index = fromContainer.findIndex(i => {
      return i === item;
    });

    let removedItem;
    if (index > -1) {
      removedItem = fromContainer.splice(index, 1);
    }

    return removedItem[0];
  }
}
