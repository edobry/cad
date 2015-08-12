ctx = $("#grid")[0].getContext("2d");

var width = ctx.canvas.width = window.innerWidth;
var height = ctx.canvas.height = window.innerHeight;

setColor = function (color) { ctx.fillStyle = color; };
reset = function () { setColor("black"); ctx.fillRect(0, 0, width, height); };
drawPoint = function (p, color) { setColor(color || "white"); ctx.fillRect(p.x,p.y,1,1); };
p = function (x,y) { return {x:x, y:y}; };
rgb = function (r,g,b) { return "rgb(" + [r,g,b].join(',') + ')' };
random = function (min, max) { return min + Math.floor(Math.random()*(max-min)); };
randomColor = function () { return rgb(random(0, 255), random(0, 255), random(0, 255)); };
times = function (n, f, instant) {
                if(n <= 0)
                    return;

                f();
                if(instant) {
                    for(var i = 0; i < n; i++)
                        f();
                }
                else
                    window.setTimeout(times, 0, --n, f);
            };
contains = function (arr, x) { return arr.indexOf(x) != -1; };
exportFuncs = function () { return Object.keys(window).filter(function(x) { return !contains(["top", "location", "document", "window", "external", "chrome", "context", "ctx", "i"], x); }).map(function(x) { return "" + x + " = " + window[x].toString() + ';'; }).join("\n"); };
randomPoint = function () { return p(random(0, ctx.canvas.width), random(0, ctx.canvas.height)); };
randomState = function () {
var state = [];
for(var x = 0; x < ctx.canvas.width; x++) {
    state[x] = Math.round(Math.random());
}
return state;
};
drawState = function (state, row) {
    for(var i = 0; i < state.length; i++) {
        if(state[i] && state[i] > 0) drawPoint(p(i, row));
    }
};
fillWithRandomState = function () { for(var y = 0; y < ctx.canvas.height; y++) drawState(randomState(), y) };
simulate = function (initial, next) { var current = initial, y = 0; times(ctx.canvas.height, function() { drawState((current = next(current)), y++) }) };
range = function (a, b) {
    var out = [];
    for(var i = a; i <= b; i++) out.push(i);
    return out;
};
invertState = function (prev) { return prev.map(function(x) { return Math.abs(x-1); }) };
zip = function () {
    var lists = Array.prototype.slice.call(arguments);
    var out = [];
    for(var i = 0; i < lists[0].length; i++) {
        out.push(lists.map(function(l) { return l[i]; }));
    }
    return out;
};
genTriplets = function (state) {
    return state.map(function(val, i, arr) { return [arr[i-1] || 0, val, arr[i+1] || 0]; });
};
toBinary = function (n) { return n.toString(2); };
fromBinary = function (b) { return parseInt(b, 2); };
rule = function (n) {
    var behavior = padTo(8, '0')(toBinary(n));
    return function(state) {
        return parseInt(behavior[7-fromBinary(state.join(''))], 10);
    };
};
padTo = function (n, char) {
    return function(str) {
        return Array(n - str.length + 1).join(char) + str;
    }
};
testRule = function (n) {
    return [[1,1,1], [1,1,0], [1,0,1], [1,0,0], [0,1,1], [0,1,0], [0,0,1], [0,0,0]].map(rule(n)).join('') == padTo(8, '0')(toBinary(n));
};
pipe = function (x) { return x; };
genBaseState = function () { return range(0, ctx.canvas.width-1).map(function(x) { return x == Math.floor(ctx.canvas.width/2) ? 1 : 0; }); };
evolveState = function (state, rule) {
    return genTriplets(state).map(rule);
};
evolver = function (rule) { return function(prev) { return evolveState(prev, rule) }; };