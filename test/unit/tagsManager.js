var tagsManager = require(__dirname + '/../../source/tagsManager.js'),
    conf        = require(__dirname + '/../appConf.js'),    
    expect      = require('chai').expect;

describe('Tags Manager Methods Test', function () {
    describe('Tags Manager _populateTags method tests', function () {
        // Set timeout of 600000 ms as by default it is 2000 ms
        this.timeout(600000);

        var tagsManagerObj = new tagsManager(conf, { tags : []});

        it('Populate tags for simple JSON object', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"]
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for an array of JSON objects', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"]
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(arrayToCheck, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for an array of mixed values', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"]
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);

            // Add few string values
            arrayToCheck.push('String value');
            arrayToCheck.push('tags');

            // Add few booleans
            arrayToCheck.push(true);
            arrayToCheck.push(false);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(arrayToCheck, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for simple JSON object - 2', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur", "liam"]
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "liam"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON array with tags present only on top level of some of objects', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var obj2 = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var obj3 = {
                "name": "First object",
                "tags": ["liam", "gaurav"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);
            arrayToCheck.push(obj2);
            arrayToCheck.push(obj3);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "liam", "gaurav"];

            tagsManagerObj._populateTags(arrayToCheck, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object - 2 levels nested with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for JSON array with nested JSON object - 2 levels nested with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var obj2 = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var obj3 = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur", "here", "gaurav"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);
            arrayToCheck.push(obj2);
            arrayToCheck.push(obj3);

            // Add few string values
            arrayToCheck.push('String value');
            arrayToCheck.push('tags');

            // Add few booleans
            arrayToCheck.push(true);
            arrayToCheck.push(false);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "diam", "ipsum", "consectetur",
            "diam", "ipsum", "consectetur", "here", "gaurav"];

            tagsManagerObj._populateTags(arrayToCheck, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object - 3 levels nested with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "grade" : {
                            "name" : "ABC"
                        }
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object with tags present only on nested level', function () {
            var obj = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "tags": ["diam", "ipsum", "consectetur"]
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object - 2 level nested with tags present only on second nested level', function () {
            var obj = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "tags": ["diam", "ipsum", "consectetur"]
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object - 3 levels nested with tags present only on 3rd nested level', function () {
            var obj = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "grade" : {
                            "name" : "ABC",
                            "tags": ["diam", "ipsum", "consectetur"],
                        }
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object with tags present on both top level and nested level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "tags": ["gaurav", "luthra"]
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "gaurav", "luthra"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object - 2 levels nested with tags present on both top level as well as second nested level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "tags": ["gaurav", "luthra"]
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "gaurav", "luthra"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object - 3 levels nested with tags present only all the levels', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "tags": ["gaurav", "luthra"],
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "grade" : {
                            "name" : "ABC",
                            "tags": ["really"]
                        }
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "gaurav", "luthra", "really"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for nested JSON object - 2 levels nested with tags present only all the levels', function () {
            var obj = {
                "tags": ["dolor"],
                "children": [
                    {
                        "foo": "bar",
                        "tags": ["ipsum", "dolor", "amet"]
                    },
                    {
                        "baz": "buzzle",
                        "tags": null
                    }
                ]
            };

            var actualValues    = [];
            var expectedValues  = ["dolor", "ipsum", "dolor", "amet"];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Populate tags for simple JSON object but it is funny object', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "friends": [
                  {
                    "id": 0,
                    "tags": [
                      "sunt",
                      "aute",
                      "eu",
                      "commodo",
                      "commodo",
                      "do",
                      "fugiat"
                    ],
                    "you" : [
                        {
                            "name" : "Gaurav",
                            "tags": [
                              "aunty"
                            ]
                        }
                    ]
                  },
                  {
                    "id": 1,
                    "tags": [
                      "excepteur",
                      "Lorem",
                      "occaecat",
                      "veniam",
                      "eu",
                      "dolor",
                      "occaecat"
                    ]
                  },
                  {
                    "id": 2,
                    "tags": [
                      "proident",
                      "ad",
                      "eu",
                      "aliquip",
                      "qui",
                      "Lorem",
                      "veniam"
                    ]
                  }
                ]
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "sunt",
              "aute",
              "eu",
              "commodo",
              "commodo",
              "do",
              "fugiat",
              "aunty",
              "excepteur",
              "Lorem",
              "occaecat",
              "veniam",
              "eu",
              "dolor",
              "occaecat",
               "proident",
              "ad",
              "eu",
              "aliquip",
              "qui",
              "Lorem",
              "veniam"
            ];

            tagsManagerObj._populateTags(obj, actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });
    });
    
    describe('Tags Manager _getTagValues method tests', function () {
        // Set timeout of 600000 ms as by default it is 2000 ms
        this.timeout(600000);

        var tagsManagerObj = new tagsManager(conf, { tags : []});

        it('Get tag values for simple JSON object', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"]
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._getTagValues(obj['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for an array of JSON objects', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"]
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            arrayToCheck.forEach(function(arrayVal) {
                tagsManagerObj._getTagValues(arrayVal['tags'], actualValues);
            });
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for an array of mixed values', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"]
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);

            // Add few string values
            arrayToCheck.push('String value');
            arrayToCheck.push('tags');

            // Add few booleans
            arrayToCheck.push(true);
            arrayToCheck.push(false);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            arrayToCheck.forEach(function(arrayVal) {
                tagsManagerObj._getTagValues(arrayVal['tags'], actualValues);
            });
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for simple JSON object - 2', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur", "liam"]
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "liam"];

            tagsManagerObj._getTagValues(obj['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for nested JSON object with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._getTagValues(obj['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for nested JSON array with tags present only on top level of some of objects', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var obj2 = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var obj3 = {
                "name": "First object",
                "tags": ["liam", "gaurav"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know"
                }
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);
            arrayToCheck.push(obj2);
            arrayToCheck.push(obj3);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "liam", "gaurav"];

            arrayToCheck.forEach(function(arrayVal) {
                tagsManagerObj._getTagValues(arrayVal['tags'], actualValues);
            });
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for nested JSON object - 2 levels nested with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._getTagValues(obj['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for JSON array with nested JSON object - 2 levels nested with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var obj2 = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var obj3 = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur", "here", "gaurav"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M"
                    } 
                }
            };

            var arrayToCheck = [];

            arrayToCheck.push(obj);
            arrayToCheck.push(obj2);
            arrayToCheck.push(obj3);

            // Add few string values
            arrayToCheck.push('String value');
            arrayToCheck.push('tags');

            // Add few booleans
            arrayToCheck.push(true);
            arrayToCheck.push(false);

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur", "diam", "ipsum", "consectetur",
            "diam", "ipsum", "consectetur", "here", "gaurav"];

            arrayToCheck.forEach(function(arrayVal) {
                tagsManagerObj._getTagValues(arrayVal['tags'], actualValues);
            });
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for nested JSON object - 3 levels nested with tags present only on top level', function () {
            var obj = {
                "name": "First object",
                "tags": ["diam", "ipsum", "consectetur"],
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "grade" : {
                            "name" : "ABC"
                        }
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._getTagValues(obj['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for nested JSON object with tags present only on nested level', function () {
            var obj = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "tags": ["diam", "ipsum", "consectetur"]
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._getTagValues(obj['school']['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for nested JSON object - 2 level nested with tags present only on second nested level', function () {
            var obj = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "tags": ["diam", "ipsum", "consectetur"]
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._getTagValues(obj['school']['teacher']['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for nested JSON object - 3 levels nested with tags present only on 3rd nested level', function () {
            var obj = {
                "name": "First object",
                "school" : {
                    "name" : "Test School",
                    "standard" : "Dont know",
                    "teacher" : {
                        "name" : "Mr ABA",
                        "sex" : "M",
                        "grade" : {
                            "name" : "ABC",
                            "tags": ["diam", "ipsum", "consectetur"],
                        }
                    } 
                }
            };

            var actualValues    = [];
            var expectedValues  = ["diam", "ipsum", "consectetur"];

            tagsManagerObj._getTagValues(obj['school']['teacher']['grade']['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });

        it('Get tag values for simple string', function () {
            var obj = {
                "tags": "First object"
            };

            var actualValues    = [];
            var expectedValues  = ["First object"];

            tagsManagerObj._getTagValues(obj['tags'], actualValues);
            expect(actualValues).to.deep.equal(expectedValues);
        });
    });

    describe('Tags Manager _searchTags method tests', function () {
        // Set timeout of 600000 ms as by default it is 2000 ms
        this.timeout(600000);

        it('Search tag values in data files', function (done) {
            var tagsManagerObj = new tagsManager(conf, { tags : [
                "yolo", "ipsum", "diam", "amet", "lectus"]
            });

            var expectedValue  = { yolo: 1, ipsum: 4, diam: 2, amet: 4, lectus: 1 };

            tagsManagerObj._searchTags(function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });

        it('Search nested tag values in data files', function (done) {
            var tagsManagerObj = new tagsManager(conf, { tags : [
                "gaurav", "luthra", "YES"]
            });

            var expectedValue  = { gaurav: 1, luthra: 3, YES: 1 };

            tagsManagerObj._searchTags(function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });

        it('Search tag values in data files - Case insensitive', function (done) {
            var tagsManagerObj = new tagsManager(conf, { tags : [
                "Yolo", "iPSum", "diam", "amet", "lectus"],
                isIgnoreCase : true
            });

            var expectedValue  = { Yolo: 1, iPSum: 4, diam: 2, amet: 4, lectus: 1 };

            tagsManagerObj._searchTags(function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });

        it('Search nested tag values in data files  - Case insensitive', function (done) {
            var tagsManagerObj = new tagsManager(conf, { tags : [
                "GAURAV", "LutHrA", "YEs"],
                isIgnoreCase : true
            });

            var expectedValue  = { GAURAV: 1, LutHrA: 3, YEs: 1 };

            tagsManagerObj._searchTags(function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });
    });
});
