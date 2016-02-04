import {inject, customElement, bindable} from 'aurelia-framework';
import {searchOperator} from '../search-operator';

@customElement('text-search')
@inject(Element)
export class TextSearch {
  @bindable entity = '';
  @bindable property = '';

  constructor(element) {
    this.element = element;

    this.value = '';
    this.prefixSelected = false;
    this.suffixSelected = false;
  }

  prefixClicked() {
    this.prefixSelected = !this.prefixSelected;
  }

  suffixClicked() {
    this.suffixSelected = !this.suffixSelected;
  }

  getOperator() {
    let operator = searchOperator.Equal;

    if (this.prefixSelected && this.suffixSelected) {
      operator = searchOperator.Contains;
    } else if (this.prefixSelected) {
      operator = searchOperator.StartsWith;
    } else if (this.suffixSelected) {
      operator = searchOperator.EndsWith;
    }

    return operator;
  }

  getResult() {
    let result = [];

    if (this.value === '') {
      return result;
    }

    result.push({
        entity: this.entity,
        criteria: {
          name: this.property,
          value: this.value,
          operator: this.getOperator()
        }
      }
    );

    return result;
  }
}
