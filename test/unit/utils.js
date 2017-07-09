var utils           = require(__dirname + '/../../utils/utils.js'),
    expect          = require('chai').expect;

describe('Tests for utility methods', function () {
    describe('Tests for clone utility method', function () {
        it('A valid object clone test', function () {
            var obj = {a : 1};
            var clonedObj = utils.clone(obj);
            expect(obj).to.deep.equal(clonedObj)
        });

        it('A valid array clone test', function () {
            var obj = [{a : 1}, {b : 2}];
            var clonedObj = utils.clone(obj);
            expect(obj).to.deep.equal(clonedObj)
        });

        it('A valid nested object clone test', function () {
            var obj = {a : 1, b : { c : 1}};
            var clonedObj = utils.clone(obj);
            expect(obj).to.deep.equal(clonedObj)
        });

        it('A valid object clone test - 2', function () {
            var obj = new Object();
            var clonedObj = utils.clone(obj);
            expect(obj).to.deep.equal(clonedObj)
        });

        it('A valid object clone test - 3', function () {
            var obj = Date.now();
            var clonedObj = utils.clone(obj);
            expect(obj).to.deep.equal(clonedObj)
        });

         it('A valid object clone test - 3', function () {
            var obj = "Hello";
            var clonedObj = utils.clone(obj);
            expect(obj).to.deep.equal(clonedObj)
        });

        it('A valid object clone test with inclusion list', function () {
            var obj = {a : 1, b: 1};
            var clonedObj = utils.clone(obj, ['a']);
            expect(clonedObj).to.deep.equal({a : 1})
        });
    });

    describe('Tests for clone utility method - Invalid inputs', function () {
        it('An invalid object clone test', function () {
            var obj = {a : 1, b: 1};
            var clonedObj = utils.clone(obj, ['a']);
            expect(obj).to.not.equal(clonedObj)
        });

        it('An invalid object clone tes - 2', function () {
            var obj = new String('Hello');
            var clonedObj = utils.clone(obj);
            expect(obj).to.not.equal(clonedObj)
        });
    });

    describe('Tests for sha1 utility method', function () {
        it('A valid input to sha1 utility method', function () {
            var sha1 = utils.sha1("hello");
            expect(sha1).to.eql("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d")
        });

        it('A valid input to sha1 utility method - 2', function () {
            var sha1 = utils.sha1("hello world");
            expect(sha1).to.eql("2aae6c35c94fcfb415dbe95f408b9ce91ee846ed")
        });

        it('A valid input to sha1 utility method - 3', function () {
            var sha1 = utils.sha1("gaurav");
            expect(sha1).to.eql("49c2398aae2e85db56ab1407c3ab1f7679e796f3")
        });

        it('A valid input to sha1 utility method - 4', function () {
            var sha1 = utils.sha1(new Buffer("hello there"));
            expect(sha1).to.eql("6e71b3cac15d32fe2d36c270887df9479c25c640")
        });

        it('A valid input to sha1 utility method - 5', function () {
            var sha1 = utils.sha1("this is great string for $#$#$$");
            expect(sha1).to.eql("07e1055d9aa0defecfcc5f920f9f3fb06e4767e6")
        });
    });

    describe('Tests for sha1 utility method - Invalid inputs', function () {
        it('An object input to sha1 utility method to throw TypeError', function () {
            var fn = utils.sha1;
            expect(fn).to.throw(TypeError);
        });

        it('A valid input to sha1 utility method - check hash length', function () {
            var sha1 = utils.sha1("hello world");
            expect(sha1.length).to.not.eql(100)
        });
    });

    describe('Tests for sort object utility method', function () {
        it('A valid scenario for sort object', function () {
            var object = {
                a : 10,
                b : 121,
                c : 19,
                d : 0
            };

            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = ['b', 'c', 'a', 'd'];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });

        it('A valid scenario for sort object - All values are equal', function () {
            var object = {
                a : 100,
                b : 100,
                c : 100,
                d : 100
            };

            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = ['a', 'b', 'c', 'd'];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });

        it('A valid scenario for sort object - All values are equal and are 0', function () {
            var object = {
                a : 0,
                b : 0,
                c : 0,
                d : 0
            };

            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = ['a', 'b', 'c', 'd'];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });

        it('A valid scenario for sort object - All values are less than zero', function () {
            var object = {
                a : -191,
                b : -192,
                c : -11,
                d : -190
            };

            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = ['c', 'd', 'a', 'b'];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });
    });

    describe('Tests for sort object utility method - Negative Cases', function () {
        it('Input is a string value', function () {
            var object = "Hello";
            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = [];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });

        it('Input is a number value', function () {
            var object = 121;
            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = [];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });

        it('Input is a boolean value', function () {
            var object = true;
            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = [];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });

        it('Input is a date value', function () {
            var object = new Date();
            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = [];
            expect(actualKeys).to.deep.equal(expectedKeys)
        });

        it('A valid scenario for sort object but expected the results in reverse order', function () {
            var object = {
                a : 10,
                b : 121,
                c : 19,
                d : 0
            };

            var actualKeys = Object.keys(utils.sortObject(object));
            var expectedKeys = ['d', 'b', 'c', 'a'];
            expect(actualKeys).to.not.equal(expectedKeys)
        });
    });
});
