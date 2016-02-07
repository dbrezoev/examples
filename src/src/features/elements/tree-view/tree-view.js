import {inject, customElement, ViewResources, bindable} from 'aurelia-framework';
import {ListItem} from './list-item';
import {customElementHelper} from 'utils';


@customElement('tree-view')
@inject(Element, ViewResources)
export class TreeView {
  @bindable data = [];

  constructor(element, viewResources) {
    this.element = element;
    this.viewResources = viewResources;
  }

  created(owningView, myView) {}

  bind(bindingContext, overrideContext) {
    this._processData();
  }

  attached() {}

  detached() {}

  unbind() {}

  dataChanged(newData, oldData) {}

  listItemClicked(listItem) {
    customElementHelper.dispatchEvent(this.element, 'select', {
      $item: listItem.item
    });

    if (this.currentActiveListItem) {
      this.currentActiveListItem.setActiveStatus(false);
    }

    listItem.setActiveStatus(true);
    this.currentActiveListItem = listItem;
  }

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

