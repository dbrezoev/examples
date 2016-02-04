import {
  TaskQueue, Container, inject, customAttribute, bindable,
  CompositionEngine, ViewSlot, ViewResources, customElement, View
} from 'aurelia-framework';

import {DOM} from 'aurelia-pal';

//@noView()
@customAttribute('popover')
@inject(DOM.Element, Container, CompositionEngine, ViewSlot, ViewResources, TaskQueue, DOM)
export class Popover {
  @bindable title;
  @bindable content;
  @bindable placement = 'auto';
  @bindable disabled = false;
  @bindable view;

  constructor(element, container, compositionEngine, viewSlot, viewResources, taskQueue, dom) {
    this.element = element;
    this.container = container;
    this.compositionEngine = compositionEngine;
    this.viewSlot = viewSlot;
    this.viewResources = viewResources;
    this.taskQueue = taskQueue;
    this.currentController = null;
    this.currentViewModel = null;
    this.dom = dom;
  }

  created(owningView, myView) {
    debugger;
    this.owningView = owningView;
  }

  bind(bindingContext, overrideContext) {
    debugger;
    this.popoverNode = this.dom.createElement('div');
    this.viewSlot = new ViewSlot(this.popoverNode, true, this);
    //this.dom.appendNode(this.popoverNode, this.element);
    this.dom.appendNode(this.popoverNode);
    this.$element = $(this.element);

    if(this.disabled) {
      return;
    }

    this.checkContent();
    this.checkPlacement();

    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;
    processInstruction(this, createInstruction(this, {
      view: this.view,
      viewModel: this.viewModel,
      model: this.model
    }));

    //this.taskQueue.queueMicroTask(() => {
    this.taskQueue.queueTask(() => {
      let y = this;
      this.$element.popover(this._getOptions());
    });
  }

  attached() {
    debugger;
  }

  detached() {
    debugger;
    this.$element.popover('dispose');
  }

  unbind() {
    debugger;
  }


  _getOptions() {
    return {
      content: this.popoverNode,
      title: this.title,
      placement: this.placement,
      trigger: 'hover',
      container: 'body',
      html: true
    };
  }

  _reinit() {
    if(this.disabled){
      return;
    }

    this.$element.popover('dispose');
    this.$element.popover(this._getOptions());
  }

  contentChanged(newValue, oldValue) {
    this._reinit();
  }

  titleChanged(newValue, oldValue) {
    this._reinit();
  }

  placementChanged(newValue, oldValue) {
    this._reinit();
  }

  checkContent() {
    if (!this.content) {
      throw new Error('Invalid value for popover content: ' + this.content);
    }
  }

  checkPlacement() {
    switch (this.placement) {
    case 'top':
    case 'bottom':
    case 'left':
    case 'right':
    case 'auto':
      break;
    default:
      throw new Error('Invalid value for popover placement: ' + this.placement);
    }
  }
}


function createInstruction(composer, instruction) {
  return Object.assign(instruction, {
    bindingContext: composer.bindingContext,
    overrideContext: composer.overrideContext,
    owningView: composer.owningView,
    container: composer.container,
    viewSlot: composer.viewSlot,
    viewResources: composer.viewResources,
    currentController: composer.currentController
  });
}

function processInstruction(composer, instruction) {
  composer.currentInstruction = null;
  composer.compositionEngine.compose(instruction).then(controller => {
    composer.currentController = controller;
    composer.currentViewModel = controller ? controller.viewModel : null;
  });
}
