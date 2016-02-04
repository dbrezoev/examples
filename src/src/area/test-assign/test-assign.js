export class Test {
  constructor() {
    this.unassignedItems = [{
      id: 1,
      name: 'Item 1'
    }, {
      id: 2,
      name: 'Item 2'
    }, {
      id: 3,
      name: 'Item 3'
    }, {
      id: 4,
      name: 'Item 4'
    }, {
      id: 5,
      name: 'Item 5'
    }];

    this.assignedItems = [{
      id: 6,
      name: 'Item 6'
    }];
  }

  //moveHandlers = {
  //  moveLeftHandler: this.moveLeftHandler.bind(this),
  //  moveRightHandler: this.moveRightHandler.bind(this),
  //  moveAllLeftHandler: this.moveAllLeftHandler.bind(this),
  //  moveAllRightHandler: this.moveAllRightHandler.bind(this)
  //};


  moveLeftHandler(itemId) {
    console.log('moved left item with id ' + itemId);
  }

  moveRightHandler(itemId) {
    console.log('moved right item with id ' + itemId);
  }

  moveAllLeftHandler(itemId) {
    console.log('moved all items left');
  }

  moveAllRightHandler(itemId) {
    console.log('moved all items right');
  }
}
