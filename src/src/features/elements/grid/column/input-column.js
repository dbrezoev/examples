import {BaseColumn} from './base-column';

export class InputColumn extends BaseColumn {
  constructor(config, template, grid) {
    super(config, template, grid);

    this.filterValue = config['filter-value'];
    if (this.filterValue === undefined) {
      const viewModelPropertyName = config['filter-value.bind'];
      if (viewModelPropertyName !== undefined) {
        this.filterValue = this.subscribe(viewModelPropertyName, 'filterValue');
      } else {
        this.filterValue = '';
      }
    }
  }

  hasFilterValue() {
    return this.filterValue !== '';
  }

  matchFilter(filteredValue) {
    if (filteredValue === undefined) {
      throw new Error('Filtered value can\'t be undefined!');
    }

    if (this.hasFilterValue()) {
      return filteredValue.toString()
        .indexOf(this.filterValue) > -1;
    }

    // no filter value -> match everything
    return true;
  }

  getFilterValue() {
    if (this.hasFilterValue()) {
      let result = [{
        name: this.field,
        value: this.filterValue
      }];
    }

    return [];
  }

  compare(first, second) {
    let result;
    if (first > second) {
      result = 1;
    } else if (first < second) {
      result = -1;
    } else {
      result = 0;
    }

    if (this.isSortDirectionDesc()) {
      result *= -1;
    }

    return result;
  }
}
