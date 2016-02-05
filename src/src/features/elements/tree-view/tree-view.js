import {inject, customElement, bindable} from 'aurelia-framework';

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
    this.treeData = flatten(this.data);
  }
}

function flatten(arr, level) {
  if (level === undefined) {
    level = 0;
  }

  return arr.reduce((flat, toFlatten) => {
    toFlatten._level = level;
    flat = flat.concat(toFlatten);
    let nodes = toFlatten.nodes;
    if (Array.isArray(nodes)) {
      flat = flat.concat(flatten(nodes, level + 1));
    }

    return flat;
  }, []);
}
