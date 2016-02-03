import {inject, customElement, bindable} from 'aurelia-framework';
import {searchOperator} from 'enum/search-operator';

@customElement('list-search')
@inject(Element)
export class ListSearch {
  @bindable entity = '';
  @bindable property = '';
  @bindable columns = [];
  @bindable models = [];

  constructor(element) {
    this.element = element;
  }

  bind() {
    this.models = this.models.map(m => {
      m.selected = false;

      return m;
    });
  }

  rowClicked(model) {
    model.selected = !model.selected;
  }

  getResult() {
    let result = [];

    if (this.models.filter(m => m.selected === true).length === 0) {
      return result;
    }

    let value = this.models.filter(model => model.selected === true).map(model => {
      return model.id;
    });

    result.push({
        entity: this.entity,
        criteria: {
          name: this.property,
          value: value,
          operator: searchOperator.Contains
        }
      }
    );

    return result;
  }
}
