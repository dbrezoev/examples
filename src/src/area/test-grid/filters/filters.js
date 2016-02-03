import {inject} from 'aurelia-framework';
import {Logger} from 'service';
import moment from 'moment';

let filtersCache = {};

@inject(Logger)
export class Filters {
  constructor(logger) {
    this.logger = logger;

    this.showFilters = true;
    this.data = this._generateTestData();

    this.selectItems = [0,1,2,3,4,5,6,7,8,9].map(num => {
      return {
        name: `end with ${num}`,
        id: num
      };
    });

    this.selectedType = 1;
    this.num = '';
    this.boolValue = false;
    this.filterDateFrom = moment().add(10, 'days');

    if (filtersCache !== undefined) {
      for (let prop in filtersCache) {
        this[prop] = filtersCache[prop];
      }
    }
  }

  detached() {
    filtersCache = {
      selectedType: this.selectedType,
      num: this.num,
      boolValue: this.boolValue,
      filterDateFrom: this.filterDateFrom
    };
  }

  _generateTestData() {
    // Return a promise that resolves to the data
    var data = [];
    var names = ["charles", "john", "oliver", "fred", "dean", "chris", "pete",
                 "steve", "lee", "rob", "alex", "rose", "mike", "dan", "james",
                 "rebecca", "heather", "kate", "liam"];

    for (var i = 0; i < 1000; i++) {
      var n = names[Math.floor(Math.random() * names.length)];
      data.push({
        id: i,
        name: n,
        isActive: i % 2 === 0,
        date: moment().add(i, 'days'),
        type: i % 10
      });
    }

    return data;
  }

  toggleFilter() {
    this.showFilters = !this.showFilters;
  }
}
