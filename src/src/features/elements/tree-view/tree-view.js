import {inject, customElement, ViewResources, bindable} from 'aurelia-framework';
import {ListItem} from './list-item';
import {customElementHelper} from 'utils';


@customElement('tree-view')
@inject(Element, ViewResources)
export class TreeView {
  @bindable data = [];
  @bindable filterFunc = null;
  @bindable filter = false;

  constructor(element, viewResources) {
    this.element = element;
    this.viewResources = viewResources;
  }

  created(owningView, myView) {}

  bind(bindingContext, overrideContext) {
    this._processData(this.data);
    if (this.filter === true) {
      this.filterChanged(this.filter);
    }
  }

  attached() {}

  detached() {}

  unbind() {}

  dataChanged(newData, oldData) {
    this._processData(newData);
  }

  filterFuncChanged(newFunc, oldFunc) {
    this.treeData.forEach(li => li.filter = newFunc);
    if (this.filter === true) {
      this.filterChanged(this.filter);
    }
  }

  filterChanged(newValue, oldValue) {
    if (newValue !== oldValue) {
      if (newValue) {
        this.treeData.forEach(li => li.applyFilter());
      } else {
        this.treeData.forEach(li => li.clearFilter());
      }
    }
  }

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

  _processData(data) {
    let listItems = data.map(d => new ListItem(d, {filter: this.filterFunc}));
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

