import {bindable} from 'aurelia-framework';

export class TestPopover {
  @bindable x;

  constructor() {
    this.title = 'Title';
    this.content = 'Content1';

    this.popoverTitle = '';
    this.items = [
      {id:"gosho", name:"gosho"},
      {id:"pesho", name:"pesho"},
      {id:"tosho", name:"tosho"}
    ];

    this.placements = [
      {id:"top", name:"top"},
      {id:"bottom", name:"bottom"},
      {id:"left", name:"left"},
      {id:"right", name:"right"}
    ];

    this.placement = this.placements[0];
    this.trigger = 'hover';
    this.triggers = [
      {id:"click", name:"click"},
      {id:"hover", name:"hover"},
      {id:"focus", name:"focus"},
      {id:"insideClick", name:"insideClick"}
    ];
  }

  click() {
    this.content = 'Content2';
    this.x = 'xasdf';
  }
}

