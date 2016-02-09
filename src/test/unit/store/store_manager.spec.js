import {Container ,TemplatingEngine, BindingEngine} from 'aurelia-framework';
import {StoreManager} from "../../../src/features/elements/grid/store/store-manager";
import {LocalStore} from "../../../src/features/elements/grid/store/local-store";
import {RemoteStore} from "../../../src/features/elements/grid/store/remote-store";
import {initialize} from 'aurelia-pal-browser';


initialize();

describe('testing store manager', () => {
  let templatingEngine;
  let container;
  let bindingEngine;
  let grid;

  beforeEach(() => {
    container = new Container();
    templatingEngine = container.get(TemplatingEngine);
    bindingEngine = container.get(BindingEngine);
    grid = {
     data: null,
     columns: [],
     sortable: true,
     filterable: true,
     pageable: true,
     pageSize: 10,
     page: 1,
     refresh: function() { },
     bindingEngine: bindingEngine
   };
 });

  it('should get local manager data', done => {
   grid.data = [ {
    id: "1",
    name: "Sean",
    occupation: "Dentist"
  },{
   id: "2",
   name: "Peter",
   occupation: "Firefighter"
 }];

 var manager = new StoreManager(grid);

 expect(manager.getDataStore() instanceof LocalStore).toBe(true);

 manager.getDataStore().getData().then((data) => { 
  expect(data.length).toEqual(grid.data.length);
  expect(data.toString()).toEqual(grid.data.toString());
  done(); 
});
});

  it('should change local manager data', done => {
   grid.data = [];
   var manager = new StoreManager(grid);
   grid.data.push({id: "3", name: "Ivan", occupation: "Freelancer" });
   manager.getDataStore().getData().then((data) => { 
    expect(data.length).toEqual(grid.data.length);
    expect(data.toString()).toEqual(grid.data.toString());
    expect(data[0].name).toEqual(grid.data[0].name);
    done(); 
  });
 });

  it('should get remote manager data', done => {
    var result = {};
    result.data = [ {
      id: "1",
      name: "Sean",
      occupation: "Dentist"
    },{
     id: "2",
     name: "Peter",
     occupation: "Firefighter"
   }];

   grid.read = function(query) {  
    return new Promise((resolve, reject) => { resolve(result); }) ;
  };

  var manager = new StoreManager(grid);

  expect(manager.getDataStore() instanceof RemoteStore).toBe(true);

  var a = manager.getDataStore().getData().then((data) => { 
   expect(data).toEqual(result.data);
   done(); 
 });
});

  it('should not change data source after unsubscribe', done => {
   grid.data = [];
   var manager = new StoreManager(grid);
   manager.unsubscribe();
   grid.data.push({id: "6", name: "Ivan", occupation: "Freelancer" });

   manager.getDataStore().getData().then((data) => { 
    expect(data.length).toEqual(0);
    done(); 
  });
 });

});