var prompt = require("prompt"),
	optimist = require("optimist"),
	keypress = require('keypress'),

	Space = require("./space");


//override with cli options
prompt.override = optimist.argv;

//but i'm not a prompt wrapper
prompt.message = prompt.delimiter = "";

prompt.start();

var onKey = function(key, cb) {
	process.stdin.on("keypress", function (ch, key) {
		if (key && key.name == key)
			cb();
	});
};



prompt.get(["height", "width"], function (err, result) {
	var space = new Space([parseInt(result.height), parseInt(result.width)], 0);
	
	console.log(space.toString());

	var evolve = function() {
		space.traverseDo(function(p) {
			p.set(p.get()+1);
		}, space.dimensions);
	};

	evolve();
	keypress(process.stdin);
	onKey("return", evolve);

	process.stdin.setRawMode(true);
	process.stdin.resume();
});
