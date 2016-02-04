export class BaseColumn {
  specialColumns = {
    heading: true,
    nosort: true,
    filter: true,
    grid: true
  };

  constructor(config, template, grid) {
    this.config = config;
    this.template = template;
    this.field = config.field;
    this.grid = grid;

    this.heading = config.heading || '';

    this.sort = config.nosort === undefined;
    this.filter = config.filter || false;

    if (!this.field && (this.sort || this.filter)) {
      throw new Error("field is required");
    }

    this.filterValue = config['filter-value'] || '';
    this.showFilter = config['show-filter'] !== 'false';

    this._subscriptions = [];
  }

  hasFilterValue() {
    throw new Error('Unimplemented method!');
  }

  matchFilter(filteredValue) {
    throw new Error('Unimplemented method!');
  }

  getFilterValue() {
    throw new Error('Unimplemented method!');
  }

  compare(first, second) {
    throw new Error('Unimplemented method!');
  }

  createDOMElement() {
    let td = document.createElement('td');
    td.innerHTML = this.template;

    // Set attributes
    for (var prop in this.config) {
      if (this.config.hasOwnProperty(prop) && this.specialColumns[prop] === undefined) {
        td.setAttribute(prop, this.config[prop]);
      }
    }

    return td;
  }

  getFieldName() {
    return this.field;
  }

  changeDirectionSort() {
    switch (this.sortDirection) {
    case 'asc':
      this.sortDirection = 'desc';
      break;
    case 'desc':
      this.sortDirection = undefined;
      break;
    default:
      this.sortDirection = 'asc';
      break;
    }

    this.grid.changeSort({
      name: this.field,
      value: this.sortDirection,
      column: this
    });
  }

  isSortDirectionDesc() {
    return this.sortDirection === 'desc';
  }

  updateFilter() {
    this.grid.updateFilters();
  }

  _updateViewModelOnPropertyChange(viewModel, viewModelPropertyName, columnPropertyName) {
    const subscription = this.grid.bindingEngine
            .propertyObserver(this, columnPropertyName)
            .subscribe((newValue, oldValue) => {
              viewModel[viewModelPropertyName] = newValue;
            });

    this._subscriptions.push(subscription);
  }

  subscribe(viewModelPropertyName, columnPropertyName) {
    if (viewModelPropertyName === undefined) {
      throw new Error('Argument exception! Argument "viewModelProperty" can\'t be empty!');
    }

    const viewModel = this.grid._parent;
    let value = viewModel[viewModelPropertyName];

    const subscription = this.grid.bindingEngine
      .propertyObserver(viewModel, viewModelPropertyName)
      .subscribe((newValue, oldValue) => {
        this.setColumnProperty(columnPropertyName, newValue);
      });

    this._subscriptions.push(subscription);
    this._updateViewModelOnPropertyChange(viewModel, viewModelPropertyName, columnPropertyName);

    return value;
  }

  setColumnProperty(columnPropertyName, newValue) {
    this[columnPropertyName] = newValue;
    this.updateFilter();
  }

  unsubscribe() {
    this._subscriptions.forEach(s => s.dispose());
  }
}
