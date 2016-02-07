import {bindable} from 'aurelia-framework';

export class Selection {
  constructor() {
    this.treeData = [{
      text: "Parent 1",
      icon: "fa fa-ban",
      nodes: [{
        text: "Child 1",
        nodes: [{
          text: "Grandchild 1"
        }, {
          text: "Grandchild 2"
        }]
      }, {
        text: "Child 2"
      }]
    }, {
      text: "Parent 2",
      nodes: [{
        text: "Child 1"
      }, {
        text: "Child 2"
      }]
    }, {
      text: "Parent 3"
    }, {
      text: "Parent 4"
    }, {
      text: "Parent 5",
      nodes: [{
        text: "Child 1",
        expanded: true,
        nodes: [{
          text: "Grandchild 1"
        }, {
          text: "Grandchild 2"
        }]
      }, {
        text: "Child 2"
      }]
    }];

    this.treeData1 = [{
      text: "First 1",
      icon: "fa fa-ban",
      nodes: [{
        text: "Child 1",
        nodes: [{
          text: "Grandchild 1"
        }, {
          text: "Grandchild 2"
        }]
      }, {
        text: "Child 2"
      }]
    }, {
      text: "Second 2",
      nodes: [{
        text: "Child 1"
      }, {
        text: "Child 2"
      }]
    }, {
      text: "Third 3"
    }, {
      text: "..Parent 4"
    }, {
      text: "..Parent 5",
      nodes: [{
        text: "Child 1",
        expanded: true,
        nodes: [{
          text: "Grandchild 1"
        }, {
          text: "Grandchild 2"
        }]
      }, {
        text: "Child 2"
      }]
    }];

    this.gridData = flatten(this.treeData);
    this.gridData1 = flatten(this.treeData1);

    this.selectedItem = undefined;
  }

  changeCollection() {
    let last = this.treeData;
    this.treeData = this.treeData1;
    this.treeData1 = last;

    last = this.gridData;
    this.gridData = this.gridData1;
    this.gridData1 = last;

    this.selectedItem = undefined;
  }

  /*
  changeNodeText() {
    if (this.selectedItem) {
      this.selectedItem.text = 
    }
  }
   */

  itemSelected(item) {
    this.selectedItem = item;
    console.log(item);
  }

  selectItem(item) {
    this.selectedItem = item;
  }
}

function flatten(arr) {
  return arr.reduce((acc, listItem) => {
    acc = acc.concat(listItem);
    if (Array.isArray(listItem.nodes)) {
      listItem.nodes.forEach(i => i.text = `${listItem.text} > ${i.text}`);
      acc = acc.concat(flatten(listItem.nodes));
    }

    return acc;
  }, []);
}
