var exports = {};

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

var set = function(val) {
	return function(point) {
		point.set(val);
	};
};

var toString = function() {
	var printRow = function(row) {
		return row.join('  ');
	};
	return this.rows.map(printRow).join('\n');
};

var Space = function(dimensions, val) {
	this.rows = traverseDo([], set(val), dimensions);
	this.toString = toString.bind(this);
};

module.exports = Space;