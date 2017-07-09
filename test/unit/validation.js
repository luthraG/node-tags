var validation      = require(__dirname + '/../../utils/validation.js'),
    expect          = require('chai').expect;

var isString        = validation.isString,
    isNumber        = validation.isNumber,
    isArray         = validation.isArray,
    isObject        = validation.isObject,
    isStrictObject  = validation.isStrictObject,
    isJSON          = validation.isJSON,
    isEmpty         = validation.isEmpty,
    isNull          = validation.isNull,
    objectEquals    = validation.objectEquals,
    containsNotNull = validation.containsNotNull;

describe('isString API Tests', function () {
    describe('Valid tests for isString API', function () {
        it('Hello is a valid string', function () {
            expect(isString('Hello')).to.be.true;
        });

        it('new String("hellow") returns a valid string', function () {
            expect(isString(new String('hellow'))).to.be.true;
        });

        it('empty quotes is a valid string value', function () {
            expect(isString('')).to.be.true;
        });
    });

    describe('Invalid tests for isString API', function () {
        it('Date.now() is not a valid string', function () {
            expect(isString(Date.now())).to.be.false;
        });

        it('Date.UTC() is not a valid string', function () {
            expect(isString(Date.UTC())).to.be.false;
        });

        it('Boolean true is not a valid string', function () {
            expect(isString(true)).to.be.false;
        });

        it('undefined is not a valid string', function () {
            expect(isString(undefined)).to.be.false;
        });

        it('null is not a valid string', function () {
            expect(isString(null)).to.be.false;
        });
    });
});

describe('isNumber API Tests', function () {
    describe('Valid tests for isNumber API', function () {
        it('0 is a valid number', function () {
            expect(isNumber(0)).to.be.true;
        });

        it('0.0 is a valid number', function () {
            expect(isNumber(0.0)).to.be.true;
        });

        it('Infinity is a valid number', function () {
            expect(isNumber(Infinity)).to.be.true;
        });

        it('Date.now() returns a valid number', function () {
            expect(isNumber(Date.now())).to.be.true;
        });

        it('4200 is a valid number', function () {
            expect(isNumber(4200)).to.be.true;
        });

        it('-41 is a valid number', function () {
            expect(isNumber(-41)).to.be.true;
        });

        it('new Number(-41) returns a valid number', function () {
            expect(isNumber(new Number(-41))).to.be.true;
        });

        it('0/0 is a valid number', function () {
            expect(isNumber(0/0)).to.be.true;
        });

        it('Infinity / Infinity is a valid number', function () {
            expect(isNumber((Infinity / Infinity))).to.be.true;
        });

        it('Infinity + (-Infinity) is a valid number', function () {
            expect(isNumber((Infinity + (-Infinity)))).to.be.true;
        });

        it('0 * (-Infinity) is a valid number', function () {
            expect(isNumber((0 * (-Infinity)))).to.be.true;
        });
    });

    describe('Invalid tests for isNumber API', function () {
        it('new Object() is not a valid number', function () {
            expect(isNumber(new Object())).to.be.false;
        });
    });
});

describe('isArray API Tests', function () {
    describe('Valid tests for isArray API', function () {
        it('[1, 2, 3] is a valid array', function () {
            expect(isArray([1, 2, 3])).to.be.true;
        });

        it('new Array("hellow") returns a valid array', function () {
            expect(isArray(new Array('hellow'))).to.be.true;
        });

        it('["hello", "world"] is a valid array value', function () {
            expect(isArray(["hello", "world"])).to.be.true;
        });

        it('["hello", "world", 1, 2, 3] is a valid array value', function () {
            expect(isArray(["hello", "world", 1, 2, 3])).to.be.true;
        });
    });

    describe('Invalid tests for isArray API', function () {
        it('Date.now() is not a valid array', function () {
            expect(isArray(Date.now())).to.be.false;
        });

        it('Date.UTC() is not a valid array', function () {
            expect(isArray(Date.UTC())).to.be.false;
        });

        it('Boolean true is not a valid array', function () {
            expect(isArray(true)).to.be.false;
        });

        it('undefined is not a valid array', function () {
            expect(isArray(undefined)).to.be.false;
        });

        it('null is not a valid array', function () {
            expect(isArray(null)).to.be.false;
        });
    });
});

describe('isStrictObject API Tests', function () {
    describe('Valid tests for isStrictObject API', function () {
        it('{} is a valid strict object value', function () {
            expect(isStrictObject({})).to.be.true;
        });

        it('new Object() returns a valid strict object value', function () {
            expect(isStrictObject(new Object())).to.be.true;
        });
    });

    describe('Invalid tests for isStrictObject API', function () {
        it('Date.now() is not a valid strict object', function () {
            expect(isStrictObject(Date.now())).to.be.false;
        });

        it('Date.UTC() is not a valid strict object', function () {
            expect(isStrictObject(Date.UTC())).to.be.false;
        });

        it('Boolean true is not a valid strict object', function () {
            expect(isStrictObject(true)).to.be.false;
        });

        it('undefined is not a valid strict object', function () {
            expect(isStrictObject(undefined)).to.be.false;
        });

        it('null is a valid strict object', function () {
            expect(isStrictObject(null)).to.be.false;
        });

        it('new Number(5) does not return a valid strict object', function () {
            expect(isStrictObject(new Number(5))).to.be.false;
        });

        it('new Array("hellow") does not return a valid strict object', function () {
            expect(isStrictObject(new Array('hellow'))).to.be.false;
        });

        it('["hello", "world", 1, 2, 3] is not a valid strict object value', function () {
            expect(isStrictObject(["hello", "world", 1, 2, 3])).to.be.false;
        });
    });
});

describe('isObject API Tests', function () {
    describe('Valid tests for isObject API', function () {
        it('new Number(5) returns a valid object', function () {
            expect(isObject(new Number(5))).to.be.true;
        });

        it('new Array("hellow") returns a valid object', function () {
            expect(isObject(new Array('hellow'))).to.be.true;
        });

        it('{} is a valid object value', function () {
            expect(isObject({})).to.be.true;
        });

        it('["hello", "world", 1, 2, 3] is a valid object value', function () {
            expect(isObject(["hello", "world", 1, 2, 3])).to.be.true;
        });

        it('null is a valid object', function () {
            expect(isObject(null)).to.be.true;
        });
    });

    describe('Invalid tests for isObject API', function () {
        it('Date.now() is not a valid object', function () {
            expect(isObject(Date.now())).to.be.false;
        });

        it('Date.UTC() is not a valid object', function () {
            expect(isObject(Date.UTC())).to.be.false;
        });

        it('Boolean true is not a valid object', function () {
            expect(isObject(true)).to.be.false;
        });

        it('undefined is not a valid object', function () {
            expect(isObject(undefined)).to.be.false;
        });
    });
});

describe('isJSON API Tests', function () {
    describe('Valid tests for isJSON API', function () {
        var str1 = "{ \"key\" : 123 }";
        it('JSON valid tests - 1', function () {
            expect(isJSON(str1)).to.be.true;
        });

        var str2 = "{ \"key\" : 123, \"key2\"  : { \"abc\" : \"hello\" } }";
        it('JSON valid tests - 2', function () {
            expect(isJSON(str2)).to.be.true;
        });

        var obj = {
            abc : {
                mnp : 1
            }
        };

         var a = {a : 'a', b : 'b', c : 'c', d : 'd'};
         var b = {a : 'a', b : 'b', c : { x : 'x', y : 'y', z : { key1 : 'value1', key2 : 'value2'}}};
         var c = {a : 'a', b : 'b', c : { x : 'x', y : 'y', z : { key1 : 'value1', key2 : 'value2', }}};  // Extra comma

        it('JSON valid tests - 3', function () {
            expect(isJSON(obj)).to.be.true;
        });

        it('JSON valid tests - 4', function () {
            expect(isJSON(a)).to.be.true;
        });

        it('JSON valid tests - 5', function () {
            expect(isJSON(b)).to.be.true;
        });

        it('JSON valid tests - 6', function () {
            expect(isJSON(c)).to.be.true;
        });

        it('new Object() returns a JSON value', function () {
            expect(isJSON(new Object())).to.be.true;
        });
    });

    describe('Invalid tests for isJSON API', function () {
        it('null is not a valid JSON value', function () {
            expect(isJSON(null)).to.be.false;
        });

        it('undefined is not a valid JSON value', function () {
            expect(isJSON(undefined)).to.be.false;
        });

        it('empty string is not a JSON value', function () {
            expect(isJSON('')).to.be.false;
        });

        it('ᴁᴪᴙݝۺ contains invalid JSON value', function () {
            expect(isJSON('ᴁᴪᴙݝۺ')).to.be.false;
        });

        it('247238 is not valid JSON value', function () {
            expect(isJSON(247238)).to.be.false;
        });

        it('Infinity is not a JSON value', function () {
            expect(isJSON(Infinity)).to.be.false;
        });

        it('Infinity / Infinity is not a JSON value', function () {
            expect(isJSON(Infinity / Infinity)).to.be.false;
        });
    });
});

describe('isEmpty API Tests', function () {
    describe('Valid tests for isEmpty API', function () {
        it('No parameters to method is a valid null value and hence empty value', function () {
            expect(isEmpty()).to.be.true;
        });

        it('null is a valid null value and hence empty value', function () {
            expect(isEmpty(null)).to.be.true;
        });

        it('undefined is a valid null value and hence empty value', function () {
            expect(isEmpty(undefined)).to.be.true;
        });

        it('0/0 is a valid null value and hence empty value', function () {
            expect(isEmpty(0/0)).to.be.true;
        });

        it('Infinity / Infinity is a valid null value and hence empty value', function () {
            expect(isEmpty((Infinity / Infinity))).to.be.true;
        });

        it('Infinity + (-Infinity) is a valid null value and hence empty value', function () {
            expect(isEmpty((Infinity + (-Infinity)))).to.be.true;
        });

        it('0 * (-Infinity) is a valid null value and hence empty value', function () {
            expect(isEmpty((0 * (-Infinity)))).to.be.true;
        });

        it('empty string is a valid empty value', function () {
            expect(isEmpty('')).to.be.true;
        });

        it('multiple spaces are not a valid empty value', function () {
            expect(isEmpty('   ')).to.be.false;
        });

        it('new Object() returns a valid empty value', function () {
            expect(isEmpty(new Object())).to.be.true;
        });
    });

    describe('Invalid tests for isEmpty API', function () {
        it('ᴁᴪᴙݝۺ is a not valid empty value', function () {
            expect(isEmpty('ᴁᴪᴙݝۺ')).to.be.false;
        });

        it('247238 is not a valid empty value', function () {
            expect(isEmpty(247238)).to.be.false;
        });

        it('Infinity is not a valid empty value', function () {
            expect(isEmpty(Infinity)).to.be.false;
        });
    });
});

describe('isNull API Tests', function () {
    describe('Valid tests for isNull API', function () {
        it('No parameters to method is a valid null value', function () {
            expect(isNull()).to.be.true;
        });

        it('null is a valid null value', function () {
            expect(isNull(null)).to.be.true;
        });

        it('undefined is a valid null value', function () {
            expect(isNull(undefined)).to.be.true;
        });

        it('0/0 is a valid null value', function () {
            expect(isNull(0/0)).to.be.true;
        });

        it('Infinity / Infinity is a valid null value', function () {
            expect(isNull((Infinity / Infinity))).to.be.true;
        });

        it('Infinity + (-Infinity) is a valid null value', function () {
            expect(isNull((Infinity + (-Infinity)))).to.be.true;
        });

        it('0 * (-Infinity) is a valid null value', function () {
            expect(isNull((0 * (-Infinity)))).to.be.true;
        });
    });

    describe('Invalid tests for isNull API', function () {
        it('hellow is not a valid null value', function () {
            expect(isNull('hellow')).to.be.false;
        });

        it('1+2+3 is not a valid null value', function () {
            expect(isNull(1+2+3)).to.be.false;
        });

        it('Infinity is not a valid null value', function () {
            expect(isNull(Infinity)).to.be.false;
        });
    });
});

var a = { a: 'text', b: [ 0, 1 ] },
    b = { a: 'text', b: [ 0, 1 ] },
    c = { a: 'text', b: 0 },
    d = { a: 'text', b: false },
    e = { a: 'text', b: [ 1, 0 ] },
    i = {
        a: 'text',
        c: {
            b: [ 1, 0 ]
        }
    },
    j = {
        a: 'text',
        c: {
            b: [ 1, 0 ]
        }
    },
    k = { a: 'text', b: null },
    l = { a: 'text', b: undefined };

var func  = function (x) { return true; },
    func2 = function (x) { return true; };

describe('objectEquals API Tests', function () {
    function Car(make, model, year, owner) {
      // do nothing
    }

    describe('Valid tests for objectEquals API', function () {
        it('null is equal to null', function () {
            expect(objectEquals(null, null)).to.be.true;
        });

        it('undefined is equal to undefined', function () {
            expect(objectEquals(undefined, undefined)).to.be.true;
        });

        var obj = {"abc" : { "xyz" : { "mno" : 123 } } };
        it('obj is equal to its copy', function () {
            expect(objectEquals(obj, Object.assign({}, obj))).to.be.true;
        });

        it('When obj1 constructor is equal to obj2 constructor', function () {
            expect(objectEquals(new Car(1990), new Car(1990))).to.be.true;
        });

        var reg1 = /123/,
            reg2 = /abc/;

        it('Two regex objects are equal to each other if same references are used - case 1', function () {
            expect(objectEquals(reg1, reg1)).to.be.true;
        });

        it('Two regex objects are equal to each other if same references are used - case 2', function () {
            expect(objectEquals(reg2, reg2)).to.be.true;
        });

        it('5 is equal to 5', function () {
            expect(objectEquals(5, 5)).to.be.true;
        });

        it('new Number(5) is equal to 5', function () {
            expect(objectEquals(new Number(5), 5)).to.be.true;
        });

        it('hello is equal to hello', function () {
            expect(objectEquals('hello', 'hello')).to.be.true;
        });

        it('[] is equal to []', function () {
            expect(objectEquals([], [])).to.be.true;
        });

        it('[1,2,3] is equal to [1,2,3]', function () {
            expect(objectEquals([1,2,3], [1,2,3])).to.be.true;
        });

        it('{} is equal to {}', function () {
            expect(objectEquals({}, {})).to.be.true;
        });

        it('{a:1,b:2} is equal to {a:1,b:2}', function () {
            expect(objectEquals({a:1,b:2},{a:1,b:2})).to.be.true;
        });

        it('{a:1,b:2} is equal to {a:1,b:2}', function () {
            expect(objectEquals({a:1,b:2},{b:2,a:1})).to.be.true;
        });

        it('a is equal to b', function () {
            expect(objectEquals(a, b)).to.be.true;
        });

        it('i is equal to j', function () {
            expect(objectEquals(i, j)).to.be.true;
        });

        it('func is equal to func', function () {
            expect(objectEquals(func, func)).to.be.true;
        });

        it('func2 is equal to func2', function () {
            expect(objectEquals(func2, func2)).to.be.true;
        });

        it('{ a: { b: func } } is equal to { a: { b: func } }', function () {
            expect(objectEquals({ a: { b: func } }, { a: { b: func } })).to.be.true;
        });

        it('new Date("2017-05-28") is equal to new Date("2017-05-28")', function () {
            expect(objectEquals(new Date("2017-05-28"), new Date("2017-05-28"))).to.be.true;
        });
    });

    describe('Invalid tests for objectEquals API', function () {
        var obj = {"abc" : { "xyz" : { "mno" : 123 } } };
        it('null is not equal to a valid object', function () {
            expect(objectEquals(null, obj)).to.be.false;
        });

        it('undefined is not equal to a valid object', function () {
            expect(objectEquals(undefined, obj)).to.be.false;
        });

        it('abc is not a equal to a valid object', function () {
            expect(objectEquals('abc', obj)).to.be.false;
        });

        it('123 not a equal to a valid object', function () {
            expect(objectEquals(123, obj)).to.be.false;
        });

        it('new Array(1, 2, 3) is not equal to a JSON object', function () {
            expect(objectEquals(new Array(1, 2, 3), obj)).to.be.false;
        });

        it('undefined is not equal to null', function () {
            expect(objectEquals(undefined, null)).to.be.false;
        });

        it('null is not equal to undefined', function () {
            expect(objectEquals(null, undefined)).to.be.false;
        });

        it('5 is not equal to 15', function () {
            expect(objectEquals(5, 15)).to.be.false;
        });

        it('[1,2,3] is not equal to [1,2,3,4]', function () {
            expect(objectEquals([1,2,3], [1,2,3,4])).to.be.false;
        });

        it('{a:1,b:2} is not equal to {a:1,b:3}', function () {
            expect(objectEquals({a:1,b:2},{a:1,b:3})).to.be.false;
        });

        it('d is not equal to k', function () {
            expect(objectEquals(d, k)).to.be.false;
        });

        it('k is not equal to l', function () {
            expect(objectEquals(k, l)).to.be.false;
        });

        it('a is not equal to c', function () {
            expect(objectEquals(a, c)).to.be.false;
        });

        it('c is not equal to d', function () {
            expect(objectEquals(c, d)).to.be.false;
        });

        it('a is not equal to e', function () {
            expect(objectEquals(a, e)).to.be.false;
        });

        it('[1, 2, undefined] is not equal to [1, 2]', function () {
            expect(objectEquals([1, 2, undefined], [1, 2])).to.be.false;
        });

        it('[1, 2, 3] is not equal to { 0: 1, 1: 2, 2: 3 }', function () {
            expect(objectEquals([1, 2, 3], { 0: 1, 1: 2, 2: 3 })).to.be.false;
        });

        it('new Date(1234) is not equal to 1234', function () {
            expect(objectEquals(new Date(1234), 1234)).to.be.false;
        });

        it('{ a: { b: func } } is not equal to { a: { b: func2 } }', function () {
            expect(objectEquals({ a: { b: func } }, { a: { b: func2 } })).to.be.false;
        });

        it('func is not equal to func2', function () {
            expect(objectEquals(func, func2)).to.be.false;
        });

        it('func is not equal to func2', function () {
            expect(objectEquals(func, func2)).to.be.false;
        });

        it('Two regex objects are not equal to each other if same references are not used - case 1', function () {
            expect(objectEquals(/123/, /123/)).to.be.false;
        });

        it('Two regex objects are not equal to each other if same references are not used - case 2', function () {
            expect(objectEquals(/abc/, /abc/)).to.be.false;
        });

        it('new Date("2017-05-28") is not equal to new Date("2017-06-28")', function () {
            expect(objectEquals(new Date("2017-05-28"), new Date("2017-06-28"))).to.be.false;
        });
    });
});

describe('containsNotNull API Tests', function () {
    describe('Valid tests for containsNotNull API', function () {
        it('["a", 1, 2] contains a valid not null string value', function () {
            expect(containsNotNull(["a", 1, 2])).to.be.true;
        });

        it('["a", "1", "2"] contains a valid string value', function () {
            expect(containsNotNull(["a", "1", "2"])).to.be.true;
        });

        it('empty array does not contain a valid string value', function () {
            expect(containsNotNull([])).to.be.false;
        });
    });

    describe('Invalid tests for containsNotNull API', function () {
        it('Date.now() does not contain a valid string value', function () {
            expect(containsNotNull(Date.now())).to.be.false;
        });

        it('Date.UTC() does not contain a valid string value', function () {
            expect(containsNotNull(Date.UTC())).to.be.false;
        });

        it('Boolean true does not contain a valid string value', function () {
            expect(containsNotNull(true)).to.be.false;
        });

        it('undefined does not contain a valid string value', function () {
            expect(containsNotNull(undefined)).to.be.false;
        });

        it('null does not contain a valid string value', function () {
            expect(containsNotNull(null)).to.be.false;
        });
    });
});