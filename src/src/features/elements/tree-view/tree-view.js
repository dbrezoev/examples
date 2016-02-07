import {inject, customElement, ViewResources, bindable, BindingEngine} from 'aurelia-framework';
import {ListItem} from './list-item';
import {customElementHelper} from 'utils';


@customElement('tree-view')
@inject(Element, ViewResources, BindingEngine)
export class TreeView {
  @bindable data = [];
  @bindable filterFunc = null;
  @bindable filter = false;

  constructor(element, viewResources, bindingEngine) {
    this.element = element;
    this.viewResources = viewResources;
    this.bindingEngine = bindingEngine;
  }

  created(owningView, myView) {}

  _subscribeToDataCollectionChanges() {
    this.dataCollectionSubscription = this.bindingEngine
      .collectionObserver(this.data)
      .subscribe(collectionChangeInfo => {
        this.treeData = processData(this.data, this.filterFunc);
      });
  }

  bind(bindingContext, overrideContext) {
    this._subscribeToDataCollectionChanges();
    this.dataPropertySubscription = this.bindingEngine
      .propertyObserver(this, 'data')
      .subscribe((newItems, oldItems) => {
        this.dataCollectionSubscription.dispose();
        this._subscribeToDataCollectionChanges();
        this.treeData = processData(newItems, this.filterFunc);
      });

    this.treeData = processData(this.data, this.filterFunc);

    if (this.filter === true) {
      this.filterChanged(this.filter);
    }
  }

  attached() {}

  detached() {}

  unbind() {
    this.dataPropertySubscription.dispose();
    this.dataCollectionSubscription.dispose();
  }

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

    if (this.currentSelectedListItem) {
      this.currentSelectedListItem.setSelectedStatus(false);
    }

    listItem.setSelectedStatus(true);
    this.currentSelectedListItem = listItem;
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

