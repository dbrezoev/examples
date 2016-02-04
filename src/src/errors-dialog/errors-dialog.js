import {inject} from 'aurelia-framework';
import {DialogController} from 'dialog';

@inject(DialogController)
export class ErrorsDialog{
  constructor(dialogController){
    this.controller = dialogController;

    this.messages = [];
  }

  activate(model){
    this.errors = model.errors;
  }
}
