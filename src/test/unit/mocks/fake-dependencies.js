import {inject, BindingEngine} from 'aurelia-framework';

@inject(BindingEngine)
export class Grid{
	constructor(bindingEngine){
		this.bindingEngine = bindingEngine;
		this.pageSize = 10;
		this.page = 1;
		this.refreshCallCount = 0;
		this.columns = [];
		this.columnDefinitions = [];
	}

	refresh(){
		this.refreshCallCount++;
	}
}

export class Pager{
	update (a, b, c) {
		
	}
}

export class Column{
	constructor(field, filterValue){
		this.field = field;
		this.filterValue = filterValue;
	}

	getFieldName(){
		return this.field;
	}

	matchFilter(filteredValue) {
		return  this.filterValue === '' || filteredValue.toString().indexOf(this.filterValue) > -1 ;
	} 
}