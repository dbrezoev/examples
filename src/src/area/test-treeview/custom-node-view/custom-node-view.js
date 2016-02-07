import {bindable} from 'aurelia-framework';

export class TreeViewCustomNodeView {
  constructor() {
    this.treeData = [{
      text: "Parent 1",
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
      view: './node-view.html'
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
  }

  click() {}
}
