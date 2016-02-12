import {inject, customElement, bindable} from 'aurelia-framework';
import {searchOperator} from '../search-operator';

@customElement('checkbox-search')
@inject(Element)
export class CheckboxSearch {
  @bindable entity = '';
  @bindable property = '';
  @bindable value = '';

  constructor(element) {
    this.element = element;

    this.isChecked = false;
  }

  getResult() {
    let result = [];

    if (this.isChecked === false) {
      return result;
    }

    result.push({
        entity: this.entity,
        criteria: {
          name: this.property,
          value: this.value,
          operator: searchOperator.Equal
        }
      }
    );

    return result;
  }
}
