
// ************************************************************************************************
//
// isString
//
// Check if the value is string or not
//
// ************************************************************************************************
function isString (value) {
    return (Object.prototype.toString.call(value) === '[object String]');
}

// ************************************************************************************************
//
// isNumber
//
// Check if the value is Number or not
//
// ************************************************************************************************
function isNumber (value) {
    return (Object.prototype.toString.call(value) === '[object Number]');
}

// ************************************************************************************************
//
// isArray
//
// Check if the value is Array or not
//
// ************************************************************************************************
function isArray(value) {
    return (Object.prototype.toString.call(value) === '[object Array]');
}

// ************************************************************************************************
//
// isObject
//
// Check if the value is Object or not 
// (Value could be String object, Number Object, Array Object, Date object etc.)
//
// ************************************************************************************************
function isObject(value) {
    return (typeof value === 'object');
}

// ************************************************************************************************
//
// isStrictObject
//
// Check if the value is Object or not 
//
// ************************************************************************************************
function isStrictObject(value) {
    return (Object.prototype.toString.call(value) === '[object Object]');
}

// ************************************************************************************************
//
// isJSON
//
// Check if the string/object is valid JSON
//
// ************************************************************************************************
function isJSON(value) {
    var retVal = false;
    try {
        if (isString(value))
            return ((typeof JSON.parse(value)) === 'object');
        else if(typeof value === 'object' && value !== null && isNaN(value))
            return ((typeof JSON.parse(JSON.stringify(value))) === 'object');
    } catch(e) {}

    return retVal;
}

// ************************************************************************************************
//
// isEmpty
//
// Check if the string doesn't contain anything
//
// ************************************************************************************************
function isEmpty (value) {
    return (isNull(value) || value.length == 0);
}

// ************************************************************************************************
//
// isNull
//
// Check if the value is null
//
// ************************************************************************************************
function isNull (value) {
    return (value === null || typeof value === 'undefined' || (isNaN(value) && !value.length));
}

// ************************************************************************************************
//
// objectEquals
//
// Check if two objects(String, Object, Number, Date, function, RegExp, Array)
//  are equal
//
// Argument(s):
// 1. x : First object to check for equality
// 2. y : Second object to check with equality
//
// ************************************************************************************************
function objectEquals(x, y) {
    'use strict';

    if (x === null || x === undefined || y === null || y === undefined)
        return x === y;

    if (x.constructor !== y.constructor) 
        return false;

    if (x instanceof Function)
      return x === y;

    if (x instanceof RegExp)
        return x === y;

     if ((x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }
    
    if (x === y || x.valueOf() === y.valueOf()) 
        return true;

    if (Array.isArray(x) && Array.isArray(y) && x.length !== y.length) 
        return false;

    if (x instanceof Date)
        return false;

    // If they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) 
        return false;

    if (!(y instanceof Object)) 
        return false;

    // recursive object equality check
    var p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
        p.every(function (i) { return objectEquals(x[i], y[i]); });
}

// ************************************************************************************************
//
// containsNotNull
//
// Checks if an array contains atleast a non null string value
//  are equal
//
// Argument(s):
// 1. values : Array of values
//
// ************************************************************************************************
function containsNotNull(values) {
    var retVal = false;
    if (values && isArray(values)) {
        (values || []).forEach(function(value) {
            if (value && isString(value) && !isNull(value))
                retVal = true;
        });
    }

    return retVal;
}

exports = module.exports = {
    isString             : isString,
    isNumber             : isNumber,
    isArray              : isArray,
    isObject             : isObject,
    isStrictObject       : isStrictObject,
    isJSON               : isJSON,
    isEmpty              : isEmpty,
    isNull               : isNull,
    objectEquals         : objectEquals,
    containsNotNull      : containsNotNull
};