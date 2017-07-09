var cacheManager    = require(__dirname + '/../../cache/cacheManager.js'),
    conf            = require(__dirname + '/../appConf.js'),    
    expect          = require('chai').expect;

describe('Cache Manager Methods Test', function () {
    describe('Cache Manager searchTags method tests', function () {
        // Set timeout of 600000 ms as by default it is 2000 ms
        this.timeout(600000);

        var cacheManagerObj = new cacheManager(conf, {});

        // Initialize the object before running test
        before(function (done) {
            cacheManagerObj
            .init(function(err) {
                if (err) done(err);
                else done();
            });
        });

        it('Search tag values in data files', function (done) {
            var expectedValue  = { yolo: 1, ipsum: 4, diam: 2, amet: 4, lectus: 1 };

            cacheManagerObj.searchTags([
                "yolo", "ipsum", "diam", "amet", "lectus"], false, function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });

        it('Search nested tag values in data files', function (done) {
            var expectedValue  = { gaurav: 1, luthra: 3, YES: 1 };

            cacheManagerObj.searchTags(["gaurav", "luthra", "YES"], false, function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });

        it('Search tag values in data files - Case insensitive', function (done) {
            var expectedValue  = { Yolo: 1, iPSum: 4, diam: 2, amet: 4, lectus: 1 };

            cacheManagerObj.searchTags(["Yolo", "iPSum", "diam", "amet", "lectus"], true, function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });

        it('Search nested tag values in data files  - Case insensitive', function (done) {
            var expectedValue  = { GAURAV: 1, LutHrA: 3, YEs: 1 };

            cacheManagerObj.searchTags(["GAURAV", "LutHrA", "YEs"], true, function(err, result) {
                if (err) {
                    done(err);  
                } else {
                    expect(result).to.deep.equal(expectedValue);
                    done();
                }
            });
        });
    });

    describe('Cache Manager _cacheContentsPath method tests', function () {
        // Set timeout of 600000 ms as by default it is 2000 ms
        this.timeout(600000);

        var cacheManagerObj = new cacheManager(conf, {});

        // Initialize the object before running test
        before(function (done) {
            cacheManagerObj
            .init(function(err) {
                if (err) done(err);
                else done();
            });
        });

        it('Tests for cache contents path', function () {
            var contentsPath = cacheManagerObj._cacheContentsPath();
            expect(contentsPath).to.eql(conf['CACHE_FILES_DIR'] + "e2f2536ff4804e26b6a93e2b1f9a2c1a5ed3cfae.contents");
        });

        it('Tests for cache contents path - No file extension', function () {
            var contentsPath = cacheManagerObj._cacheContentsPath();
            expect(contentsPath).to.not.equal(conf['CACHE_FILES_DIR'] + "e2f2536ff4804e26b6a93e2b1f9a2c1a5ed3cfae");
        });

        it('Tests for cache contents path - Invalid hash', function () {
            var contentsPath = cacheManagerObj._cacheContentsPath();
            expect(contentsPath).to.not.equal("erf2536ff4804e26b6a93e2b1f9a2c1a5ed3cfae.contents");
        });       
    });

    describe('Cache Manager _cacheMetaPath method tests', function () {
        // Set timeout of 600000 ms as by default it is 2000 ms
        this.timeout(600000);

        var cacheManagerObj = new cacheManager(conf, {});

        // Initialize the object before running test
        before(function (done) {
            cacheManagerObj
            .init(function(err) {
                if (err) done(err);
                else done();
            });
        });

        it('Tests for cache meta path', function () {
            var metaPath = cacheManagerObj._cacheMetaPath();
            expect(metaPath).to.eql(conf['CACHE_FILES_DIR'] + "e2f2536ff4804e26b6a93e2b1f9a2c1a5ed3cfae.meta");
        });

        it('Tests for cache meta path - No file extension', function () {
            var metaPath = cacheManagerObj._cacheMetaPath();
            expect(metaPath).to.not.equal(conf['CACHE_FILES_DIR'] + "e2f2536ff4804e26b6a93e2b1f9a2c1a5ed3cfae");
        });

        it('Tests for cache meta path - Invalid hash', function () {
            var metaPath = cacheManagerObj._cacheMetaPath();
            expect(metaPath).to.not.equal("erf2536ff4804e26b6a93e2b1f9a2c1a5ed3cfae.meta");
        });       
    });
});
