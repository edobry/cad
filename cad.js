var prompt = require("prompt"),
	optimist = require("optimist"),

	Space = require("./space");


//override with cli options
prompt.override = optimist.argv;

//but i'm not a prompt wrapper
prompt.message = prompt.delimiter = "";

prompt.start();

prompt.get(["height", "width"], function (err, result) {
	var space = new Space([parseInt(result.height), parseInt(result.width)], 0);
	console.log(space.toString());
});
