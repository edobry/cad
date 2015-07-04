var exports = {};

var traverseDo = function(func, bounds) {
	var measureDimension = function(dim) {
		var incr = function(val) {
			return function() {
				val++;
			};
		};

		var size = 0;
		this.traverseDo(incr(size), [1, space[0].length]);
		return size;
	};
	var getBound = function(dim) {
		return (bounds && bounds[dim]
					? bounds[dim]
					: measureDimension.bind(this)(dim)
			   );
	};

	for(i = 0; i < getBound(0); i++) {
		if(!this.rows[i])
			this.rows[i] = [];

		for(j = 0; j < getBound(1); j++) {
			func(this.visit([i,j]));
		}
	}
};

var toString = function() {
	var printRow = function(row) {
		return row.join('  ');
	};
	return this.rows.map(printRow).join('\n');
};

var visit = function(pos) {
	var self = this;
	return {
		get: function() {
			return self.rows[pos[0]][pos[1]];
		},
		set: function(val) {
			self.rows[pos[0]][pos[1]] = val;
		}
	};
};

var set = function(val) {
	return function(point) {
		point.set(val);
	};
};

var Space = function(dimensions, val) {
	this.rows = [];
	this.toString = toString.bind(this);
	this.visit = visit.bind(this);
	this.traverseDo = traverseDo.bind(this);
	this.dimensions = dimensions;
	
	this.traverseDo(set(val), dimensions);
};

module.exports = Space;