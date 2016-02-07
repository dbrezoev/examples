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
    this.treeData = processData(this.data, this.filterFunc);
    if (this.filter === true) {
      this.filterChanged(this.filter);
    }
  }

  attached() {}

  detached() {}

  unbind() {}

  dataChanged(newData, oldData) {
    this.treeData = processData(newData, this.filterFunc);
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
}


function processData(data, filterFunc) {
  let listItems = data.map(d => new ListItem(d, {filter: filterFunc}));
  return flatten(listItems);
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

