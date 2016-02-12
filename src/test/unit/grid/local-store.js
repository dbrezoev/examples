import {Container} from 'aurelia-framework';
import {initialize} from 'aurelia-pal-browser';
import {LocalStore} from "../../../src/features/elements/grid/store/local-store";
import {DataFeeder} from "../mocks/data-feeder";
import {Grid, Pager, Column} from "../mocks/fake-dependencies";

initialize();

describe('testing local store pager:', () =>{

	let container, grid, feeder, pager;
	beforeEach(() => {
		container = new Container(),
		feeder = container.get(DataFeeder),
		grid = container.get(Grid),
		grid.pageSize = 20,
		grid.pageable = true,
		grid.data = feeder.generateData(3000);
		
	});

	it('should change data source on paging', done => {
		var s = grid.pageSize * 5,
		n = feeder.getRandom(Math.ceil(grid.data.length / s)) + 1,
		pagerUpdateCalled = false,
		n =  n == 1 ? n + 1 : n,
		pager = container.get(Pager),

		store = new LocalStore(grid.data, grid);
		spyOn(pager, 'update');
		store.setPage(n);
		store.setPageSize(s);
		store.setPager(pager);

		store.getData().then(data => {
			expect(data.length).toBe(s);
			expect(data).toEqual(grid.data.slice((n-1) * s , n * s));
			expect(pager.update.calls.any()).toBeTruthy();
			expect(store.firstVisibleItem).toBe((n - 1) * Number(s) + 1);
			expect(store.lastVisibleItem).toBe(Math.min((n) * Number(s), grid.data.length));
			done();
		});

	});

	it('should show all the data on disabled paging', done => {
		grid.pageable = false;
		var s = grid.pageSize * 5,
		n = feeder.getRandom(Math.ceil(grid.data.length / s)) + 1,
		pagerUpdateCalled = false,
		n =  n == 1 ? n + 1 : n,
		store = new LocalStore(grid.data, grid);

		store.setPage(n);
		store.setPageSize(s);
		store.getData().then(data => {
			expect(data.length).toBe(grid.data.length);
			expect(data).toEqual(grid.data);
			done();
		});

	});
});


describe('testing local store filter:', () => {
	let container, feeder;
	beforeEach(() => {
		container = new Container(),
		feeder = container.get(DataFeeder);

	});

	it('should filter by input column', done => {
		debugger;
		var filterValue = 'harl', field = 'name',
		grid = {
			filterable: true,
			columnDefinitions: [ new Column(field, filterValue)]

		},
		store = new LocalStore(feeder.generateData(300), grid);

		var expected = store.data.filter((row) =>{  return row[field].indexOf(filterValue) > -1; });

		store.getData().then(data => {
			expect(data.length).toBe(expected.length);
			expect(data).toEqual(expected);
			done();
		});
	});
});

