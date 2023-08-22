"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.part2 = exports.part1 = void 0;
var Greeter = /** @class */ (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
}());
var greeter = new Greeter("world");
var Elf = /** @class */ (function () {
    function Elf(calorieArray) {
        this.calories = calorieArray.map(parseInt)
            .reduce(function (prev, cur) { return cur + prev; }, 0);
    }
    return Elf;
}());
var solve = function (input) {
    var sanitized = input.replaceAll('\r', '\n');
    var groups = sanitized.split('\n\n');
    var elves = sanitized
        .split('\n\n')
        .map(function (e) { return e.split('\n'); })
        .map(function (e) { return new Elf(e); })
        .sort(function (elfA, elfB) { return elfA.calories - elfB.calories; });
    //elves = elves
    return elves;
    // var most = [0, 0, 0]; // 0 = 1st, 1 = 2nd, 2 = 3rd
    // var total = 0;
    // for (let index = 0; index <= lines.length; index++) { // TODO: We depend on this to go out of index... not good
    //     const number = parseInt(lines[index]);
    //     if (Number.isNaN(number)) {
    //         if (total > most[0]) {
    //             most.splice(0, 0, total);
    //             most.pop();
    //         }
    //         else if (total > most[1]) {
    //             most.splice(1, 0, total);
    //             most.pop();
    //         }
    //         else if (total > most[2]) {
    //             most.splice(2, 0, total);
    //             most.pop();
    //         }
    //         total = 0;
    //         continue;
    //     }
    //     total += number;
    // }
    // return most;
};
var part1 = function (input) { return solve(input)[0]; };
exports.part1 = part1;
var part2 = function (input) { return solve(input).reduce(function (prev, cur) { return prev + cur; }, 0); };
exports.part2 = part2;
