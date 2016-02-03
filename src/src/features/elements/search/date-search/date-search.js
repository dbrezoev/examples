import {inject, customElement, bindable} from 'aurelia-framework';
import {searchOperator} from 'enum/search-operator';

@customElement('date-search')
@inject(Element)
export class DateSearch {
  @bindable entity = '';
  @bindable property = '';

  constructor(element) {
    this.element = element;

    this.startDate = false;
    this.endDate = false;
  }

  getResult() {
    let result = [];

    if (this.startDate === false && this.endDate === false) {
      return result;
    }

    if (this.startDate !== false) {
      result.push({
        entity: this.entity,
        criteria: {
          name: this.property,
          value: this.startDate.toISOString(),
          operator: searchOperator.GreaterThanOrEqual
        }
      });
    }

    if (this.endDate !== false) {
      result.push({
        entity: this.entity,
        criteria: {
          name: this.property,
          value: this.endDate.toISOString(),
          operator: searchOperator.LessThan
        }
      });
    }

    return result;
  }
}
