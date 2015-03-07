var prompt = require("prompt"),
	optimist = require("optimist");

var traverseDo = function(space, func, bounds) {
	var measureDimension = function(space, dim) {
		var incr = function(val) {
			return function() {
				val++;
			};
		};

		var size = 0;
		traverseDo(space, incr(size), [1, space[0].length]);
		return size;
	};
	var getBound = function(dim) {
		return (bounds && bounds[dim]
					? bounds[dim]
					: measureDimension(space, dim)
			   );
	};
	var setter = function(pos) {
		return function(val) {
			space[pos[0]][pos[1]] = val;
		};
	};
	var getter = function(pos) {
		return function() {
			return space[pos[0]][pos[1]];
		};
	};
	var visit = function(pos) {
		return {
			get: getter(pos),
			set: setter(pos)
		};
	};

	for(i = 0; i < getBound(0); i++) {
		if(!space[i])
			space[i] = [];

		for(j = 0; j < getBound(1); j++) {
			func(visit([i,j]));
		}
	}
	return space;
};

var createSpace = function(dimensions, val) {
	var set = function(val) {
		return function(point) {
			point.set(val);
		};
	};

	return traverseDo([], set(val), dimensions);
};

var printSpace = function(space) {
	var print = function(x) { console.log(x); };
	var printRow = function(row) {
		return row.join(' ');
	};
	space.map(printRow).forEach(print);
};

var generateSpace = function(height, width) {
	return createSpace([height, width], 0);
};

//override with cli options
prompt.override = optimist.argv;

//but i'm not a prompt wrapper
prompt.message = prompt.delimiter = "";

prompt.start();

prompt.get(["height", "width"], function (err, result) {
	var space = generateSpace(parseInt(result.height), parseInt(result.width));
	printSpace(space);
});
