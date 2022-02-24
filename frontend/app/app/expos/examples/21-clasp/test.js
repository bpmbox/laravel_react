// Compiled using ts2gas 3.4.4 (TypeScript 3.6.4)
var exports = exports || {};
var module = module || { exports: exports };
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// Optional Types
var isDone = false;
var height = 6;
var bob = "bob";
var list1 = [1, 2, 3];
var list2 = [1, 2, 3];
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
var notSure = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
function showMessage(data) {
    Logger.log(data);
}
showMessage("hello");
// Classes
var Hamburger = /** @class */ (function () {
    function Hamburger() {
        // This is the constructor.
    }
    Hamburger.prototype.listToppings = function () {
        // This is a method.
    };
    return Hamburger;
}());
// Template strings
var name = "Sam";
var age = 42;
console.log("hello my name is " + name + ", and I am " + age + " years old");
// Rest arguments
var add = function (a, b) { return a + b; };
var args = [3, 5];
add.apply(void 0, args); // same as `add(args[0], args[1])`, or `add.apply(null, args)`
// Spread operator (array)
var cde = ["c", "d", "e"];
var scale = __spreadArrays(["a", "b"], cde, ["f", "g"]); // ['a', 'b', 'c', 'd', 'e', 'f', 'g']
// Spread operator (map)
var mapABC = { a: 5, b: 6, c: 3 };
var mapABCD = __assign(__assign({}, mapABC), { d: 7 }); // { a: 5, b: 6, c: 3, d: 7 }
// Destructure map
var jane = { firstName: "Jane", lastName: "Doe" };
var john = { firstName: "John", lastName: "Doe", middleName: "Smith" };
function sayName(_a) {
    var firstName = _a.firstName, lastName = _a.lastName, _b = _a.middleName, middleName = _b === void 0 ? "N/A" : _b;
    console.log("Hello " + firstName + " " + middleName + " " + lastName);
}
sayName(jane); // -> Hello Jane N/A Doe
sayName(john); // -> Helo John Smith Doe
// Export (The export keyword is ignored)
exports.pi = 3.141592;
// Google Apps Script Services
//var doc = DocumentApp.create("Hello, world!");
//doc.getBody().appendParagraph("This document was created by Google Apps Script.");
// Decorators
function Override(label) {
    return function (target, key) {
        Object.defineProperty(target, key, {
            configurable: false,
            get: function () { return label; }
        });
    };
}
var Test = /** @class */ (function () {
    function Test() {
        this.name = "pat";
    }
    __decorate([
        Override("test") // invokes Override, which returns the decorator
    ], Test.prototype, "name");
    return Test;
}());
var t = new Test();
console.log(t.name); // 'test'
