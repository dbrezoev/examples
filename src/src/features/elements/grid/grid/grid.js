import {customElement, TaskQueue, useView, bindable, inject, BindingEngine,
  processContent, TargetInstruction, ViewCompiler, ViewSlot, ViewResources,
  Container} from 'aurelia-framework';
import {processUserTemplate} from './proccess-user-template';
import {ColumnDefinitionFactory} from '../column/column-definition-factory';
import {StoreManager} from '../store/store-manager';

@customElement('grid')
@processContent(processUserTemplate)
@inject(Element, ViewCompiler, ViewResources, Container, TargetInstruction, BindingEngine, TaskQueue)
export class Grid {

  /* == Styling == */
  @bindable height = null;

  // Filtering
  @bindable showFilters = false;
  @bindable filterable = true;
  @bindable filterDebounce = 500;

  // Sortination
  @bindable sortable = true;


  // Column defs
  @bindable showColumnHeaders = true;
  columnHeaders = [];
  columns = [];
  @bindable columnsMetadata = null;

  // Selection
  @bindable selection = false; // single || multiselect
  @bindable onSelect = null; // callback
  @bindable selectedItem = undefined;
  lastSelectedItem = undefined;

  // Misc
  @bindable noRowsMessage = "";

  // Data ....
  @bindable read = null;
  @bindable data = null;
  @bindable autoLoad = true;
  loading = false;
  @bindable loadingMessage = "Loading...";
  rowData = [];

  // Pagination
  @bindable pageable = false;
  @bindable pageSize = 10;
  @bindable pagerSize = 10;
  @bindable page = 1;
  @bindable showFirstLastButtons = true;
  @bindable showJumpButtons = true;
  @bindable showPageSizeBox = true;
  @bindable showPagingSummary = true;
  @bindable pageSizes = [10, 25, 50];


  // Subscription handling
  unbinding = false;

  // Visual
  // TODO: calc scrollbar width using browser
  scrollBarWidth = 16;

  constructor(element, vc, vr, container, targetInstruction, bindingEngine, taskQueue) {
    this.element = element;
    // Services
    this.viewCompiler = vc;
    this.viewResources = vr;
    this.container = container;
    this.bindingEngine = bindingEngine;
    this.taskQueue = taskQueue;
    const gridDefinition = targetInstruction.behaviorInstructions[0].gridDefinition;
    this.columnDefinitionFactory = new ColumnDefinitionFactory(gridDefinition, this);
    this.pageable = gridDefinition.paginationAttrs;
  }

  bind(bindingContext, overrideContext) {
    this._parent = bindingContext;

    if (this.columnsMetadata === null) {
      this.columns = this.columnDefinitionFactory.create();
    } else {
      this.columns = this.columnDefinitionFactory.create(this.columnsMetadata);
    }

    this.storeManager = new StoreManager(this);

    // Listen for window resize so we can re-flow the grid layout
    this.resizeListener = window.addEventListener('resize', (() => {
      if (this.height === 'auto') {
        this.syncGridHeight();
      }

      this.syncColumnHeadersWithColumns();
    }).bind(this));


    // The table body element will host the rows
    var tbody = this.element.querySelector("table>tbody");
    this.viewSlot = new ViewSlot(tbody, true, this);

    // Get the row template too and add a repeater
    var row = tbody.querySelector("tr");
    this._addRowAttributes(row);

    this.rowTemplate = document.createDocumentFragment();
    this.rowTemplate.appendChild(row);

    this._buildTemplates();
  }

  attached() {
    this._height = this.height;
    if (this.height === 'auto') {
      this.syncGridHeight();
    }

    this.heightChanged();

    if (this.autoLoad) {
      this.refresh();
    }

    if (this.pageable === true) {
      this.storeManager.getDataStore().setPager(this.pager);
    }
  }

  _addRowAttributes(row) {
    row.setAttribute("repeat.for", "$item of rowData");
    // Copy any user specified row attributes to the row template
    for (var prop in this.rowAttrs) {
      if (this.rowAttrs.hasOwnProperty(prop)) {
        row.setAttribute(prop, this.rowAttrs[prop]);
      }
    }
  }

  _buildTemplates() {
    // Create a fragment we will manipulate the DOM in
    let rowTemplate = this.rowTemplate.cloneNode(true);
    let row = rowTemplate.querySelector('tr');

    // Create the columns
    this.columns
      .map(c => c.createDOMElement())
      .forEach(row.appendChild.bind(row));

    // Now compile the row template
    let view = this.viewCompiler.compile(rowTemplate, this.viewResources).create(this.container);
    view.bind(this);

    // based on viewSlot.swap() from templating 0.16.0
    let removeResponse = this.viewSlot.removeAll();
    if (removeResponse instanceof Promise) {
      removeResponse.then(() => this.viewSlot.add(view));
    }

    this.viewSlot.add(view);
    this.viewSlot.attached();

    // HACK: why is the change handler not firing for noRowsMessage?
    this.noRowsMessageChanged();
  }

  unbind() {
    this.unbinding = true;
    window.removeEventListener('resize', this.resizeListener);
    this.columns.forEach(c => c.unsubscribe());
    this.storeManager.unsubscribe();
  }

  // call function from parent context where grid is composed
  call(funcName, ...params) {
    this._parent[funcName].apply(this._parent, params);
  }

  changeSort(sort) {
    this.storeManager.getDataStore().changeSortProcessingOrder(sort);
    this.refresh();
  }

  debounce(func, wait) {
    var timeout;

    // the debounced function
    return function () {
      var context = this,
        args = arguments;

      // nulls out timer and calls original function
      var later = function () {
        timeout = null;
        func.apply(context, args);
      };

      // restart the timer to call last function
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  updateFilters() {
    // Debounce
    if (!this.debouncedUpdateFilters) {
      this.debouncedUpdateFilters = this.debounce(this.refresh, this.filterDebounce || 100);
    }

    this.debouncedUpdateFilters();
  }

  /* === Data === */
  refresh() {
    this.loading = true;
    this.storeManager.getDataStore().getData().then(data => {
      // todo: enable case for empty column?
      //this.checkData(result.data);
      this.rowData = data;
      this.loading = false;

      this.taskQueue.queueTask(() => this.syncColumnHeadersWithColumns());
    });
  }

  checkData(data) {
    data.forEach(d => {
      this.columns.forEach(c => {
        let propName = c.getFieldName();
        if (d[propName] === undefined) {
          console.error(d, c);
          throw new Error(`Data must have property named: ${propName}`);
        }
      });
    });
  }

  /* === Change handlers === */
  rowClicked($item, selectRow) {
    selectRow = selectRow !== undefined ? selectRow : !$item._selected;
    if (this.onSelect !== null) {
      this.onSelect($item, selectRow);
    }

    if (this.selection !== false) {
      $item._selected = selectRow;
      if (this.selection === 'single') {
        if (this.lastSelectedItem !== undefined && this.lastSelectedItem !== $item) {
          this.lastSelectedItem._selected = false;
        }

        this.lastSelectedItem = $item;
      }
    }
  }

  selectedItemChanged(newValue, oldValue) {
    if (newValue === oldValue) {
      return;
    }

    if (newValue) {
      if (newValue !== this.lastSelectedItem || !this.lastSelectedItem._selected) {
        this.rowClicked(newValue, true);
        this.taskQueue.queueMicroTask((() => {
          let row = this.element.querySelector('tr.table-info');
          if (row !== null) {
            row.scrollIntoView();
          }
        }).bind(this));
      } else {
        // row is already clicked
      }
    } else {
      // unclick
      this.rowClicked(this.lastSelectedItem, false);
    }
  }

  pageChanged(page, oldValue) {
    if (page !== oldValue) {
      this.page = Number(page);
      this.storeManager.getDataStore().setPage(page);
      this.refresh();
    }
  }

  pageSizeChanged(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.storeManager.getDataStore().setPageSize(newValue);
      this.pageChanged(1);
    }
  }

  noRowsMessageChanged() {
    this.showNoRowsMessage = this.noRowsMessage !== "";
  }

  heightChanged() {
    var cont = this.element.querySelector(".grid-content-container");

    if (this.height === 'auto' || window.isNaN(window.Number(this._height)) === false) {
      //cont.setAttribute("style", "height:" + this.height + "px");
      cont.setAttribute("style", `height: ${this._height}px`);
    } else {
      cont.removeAttribute("style");
    }
  }

  /* === Visual === */
  syncGridHeight() {
    const headerTable = this.element.querySelector('table.grid-header-table');
    const headerHeight = headerTable.offsetHeight;
    const gridFooter = this.element.querySelector('grid-footer-container');
    let gridFooterHeight = 0;
    if (gridFooter !== null) {
      gridFooterHeight = gridFooter.offsetHeight;
    }

    const gridContainerTopAndBottomBorderWidth = 2;
    this._height = this.element.parentElement.clientHeight - headerHeight - gridFooterHeight - gridContainerTopAndBottomBorderWidth;
    this.heightChanged();
  }

  syncColumnHeadersWithColumns() {
    // Get the header row
    let headers = this.element.querySelectorAll("table>thead>tr:first-child>th");
    let filters = this.element.querySelectorAll("table>thead>tr:last-child>th");

    // Get the first row from the data if there is one...
    let cells = this.element.querySelectorAll("table>tbody>tr:first-child>td");

    for (let i = 0; i < headers.length; i++) {
      let header = headers[i];
      let filter = filters[i];
      let cell = cells[i];

      if (cell && header && filter) {
        let columnWidth = cell.getAttribute('width');

        if (columnWidth) {
          columnWidth = parseInt(columnWidth);
        } else {
          let tdWidth = cell.offsetWidth;
          let thWidth = header.offsetWidth;
          columnWidth = Math.max(tdWidth, thWidth);
        }

        let headerWidth = columnWidth;
        let overflow = this.isBodyOverflowing();
        if ((i === headers.length - 1) && overflow) {
          headerWidth += this.scrollBarWidth;
        }

        // Make the header the same width as the cell...
        header.setAttribute("style", `width: ${headerWidth}px`);
        filter.setAttribute("style", `width: ${headerWidth}px`);
        cell.setAttribute("style", `width: ${columnWidth}px`);
      }
    }
  }

  isBodyOverflowing() {
    var body = this.element.querySelector(".grid-content-container");
    return body.offsetHeight < body.scrollHeight || body.offsetWidth < body.scrollWidth;
  }
}
