import {inject} from 'aurelia-framework';
import {Logger} from 'service';

@inject(Logger)
export class PaginationRemote {
  constructor(logger) {
    this.logger = logger;
    this.gridHeight = 400;
    window.x = this;

    this.data = this._generateTestData();
  }

  _generateTestData() {

    // Return a promise that resolves to the data
    var data = [];
    var names = ["charles", "john", "oliver", "fred", "dean", "chris", "pete", "steve", "lee", "rob", "alex", "rose", "mike", "dan", "james", "rebecca", "heather", "kate", "liam"];

    for (var i = 0; i < 1000; i++) {
      var n = names[Math.floor(Math.random() * names.length)];
      data.push({
        id: i,
        name: n,
        isActive: i % 2 === 0
      });
    }

    return data;
  }

  itemClicked(item) {
    console.info(item);
    this.logger.info(`You clicked on: ${item.name}`);
  }

  addItem() {
    this.data.unshift({
      id: -1,
      name: 'xxxxx'
    });
  }

  changeItem() {
    this.data = [{
      id: -1,
      name: 'xxxxx'
    }];
  }

  itemSelected(item) {
    console.info(item);
    this.logger.info(`You selected item: ${item.name}`);
  }

  getData(sortersFiltersPaginationData) {
    // simulate remote filtering, sorting and paging
    const page = sortersFiltersPaginationData.paging.page;
    const count = sortersFiltersPaginationData.paging.count;
    const startIndex = (page - 1) * count;
    let endIndex = startIndex + count;
    if (endIndex > this.data.length) {
      endIndex = this.data.length - 1;
    }
    let tempData = this.data.slice(startIndex, endIndex);
    return new Promise((resolve, reject) => {
      resolve({
        data: tempData,
        count: this.data.length
      });
    });
  }
}
