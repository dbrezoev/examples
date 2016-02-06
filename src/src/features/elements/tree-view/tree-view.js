import {inject, customElement, bindable} from 'aurelia-framework';
import {ListItem} from './list-item';


@customElement('tree-view')
@inject(Element)
export class TreeView {
  @bindable data = [];

  constructor(element) {
    this.element = element;
  }

  created(owningView, myView) {}

  bind(bindingContext, overrideContext) {
    this._processData();
  }

  attached() {}

  detached() {}

  unbind() {}

  dataChanged(newData, oldData) {}

  _processData() {
    let listItems = this.data.map(d => new ListItem(d));
    this.treeData = flatten(listItems);
  }
}

function flatten(arr) {
  return arr.reduce((acc, listItem) => {
    acc = acc.concat(listItem);
    if (listItem.hasChildren) {
      acc = acc.concat(flatten(listItem.getChildren()));
    }

    return acc;
  }, []);
}

