import {inject, customElement, bindable, computedFrom, bindingMode} from 'aurelia-framework';
import {customElementHelper} from 'utils';

@customElement('assign')
@inject(Element)
export class Assign {
  @bindable({defaultBindingMode: bindingMode.twoWay}) leftItems;
  @bindable({defaultBindingMode: bindingMode.twoWay}) rightItems;

  constructor(element) {
    this.element = element;
    this.selectedItemId;
  }

  @computedFrom('selectedItemId')
  get moveRightDisabled() {
    let moveRightDisabled = this.leftItems.every(item => {
      return item.id !== this.selectedItemId;
    });
    return moveRightDisabled;
  }

  @computedFrom('selectedItemId')
  get moveLeftDisabled() {
    let moveLeftDisabled = this.rightItems.every(item => {
      return item.id !== this.selectedItemId;
    });
    return moveLeftDisabled;
  }

  select(itemId) {
    this.selectedItemId = itemId;

    let allItems = this.leftItems.concat(this.rightItems);
    allItems.forEach(item => {
      item.selected = item.id === itemId;
    });

    customElementHelper.dispatchEvent(this.element, 'item-click', {
      itemId: this.selectedItemId
    });

    if (typeof(this.selectItemHandler) === 'function') {
      this.selectItemHandler(this.selectedItemId);
    }
  }

  moveLeft() {
    let fromCollection = this.rightItems;
    let toCollection = this.leftItems;

    let item = this._remove(fromCollection, this.selectedItemId);
    this._add(toCollection, item);

    customElementHelper.dispatchEvent(this.element, 'move-left-click', {
      itemId: this.selectedItemId
    });


    item.selected = false;
    this.selectedItemId = undefined;
  }

  moveRight() {
    let fromCollection = this.leftItems;
    let toCollection = this.rightItems;

    let item = this._remove(fromCollection, this.selectedItemId);
    this._add(toCollection, item);

    customElementHelper.dispatchEvent(this.element, 'move-right-click', {
      itemId: this.selectedItemId
    });

    item.selected = false;
    this.selectedItemId = undefined;
  }

  moveAllLeft() {
    let allItems = this.leftItems.concat(this.rightItems);

    allItems.forEach(item => {
      item.selected = false;
    });

    this.selectedItemId = undefined;

    this.leftItems = allItems;
    this.rightItems = [];

    customElementHelper.dispatchEvent(this.element, 'move-all-left-click', {});
  }

  moveAllRight() {
    let allItems = this.leftItems.concat(this.rightItems);

    allItems.forEach(item => {
      item.selected = false;
    });

    this.selectedItemId = undefined;

    this.rightItems = allItems;
    this.leftItems = [];

    customElementHelper.dispatchEvent(this.element, 'move-all-right-click', {});
  }

  _add(toContainer, item) {
    toContainer.push(item);
  }

  _remove(fromContainer, itemId) {
    let index = fromContainer.findIndex(item => {
      return item.id === itemId;
    });

    let removedItem;
    if (index > -1) {
      removedItem = fromContainer.splice(index, 1);
    }

    return removedItem[0];
  }
}
