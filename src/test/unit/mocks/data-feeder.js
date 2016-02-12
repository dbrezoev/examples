export class DataFeeder{
	generateData(count){
		var data = [];
		var names = ["charles", "john", "oliver", "fred", "dean", "chris", "pete", "steve", "lee", "rob", "alex", "rose", "mike", "dan", "james", "rebecca", "heather", "kate", "liam", "charlie"];

		for (var i = 0; i < count; i++) {
			var n = names[this.getRandom(names.length)];
			data.push({
				id: i,
				name: n,
				isActive: i % 2 === 0
			});
		}
		return data;
	}

	getRandom(len){
		return Math.floor(Math.random() * len);
	}
}