var sanity  = require(__dirname + '/../../utils/sanity.js'),
    expect  = require('chai').expect;

describe('Sanity APIs tests', function () {
    describe('directoryExists Sanity Tests - Valid inputs', function () {
        // Set timeout of 15000 ms as by default it is 2000 ms
        this.timeout(15000);
        it('A valid directory path is given', function (done) {
            sanity.directoryExists(__dirname, function(err) {
                if (err) done(err);
                else done();
            });
        });

        it('A valid directory path is given - 2', function (done) {
            sanity.directoryExists(__dirname + '/../', function(err) {
                if (err) done(err);
                else done();
            });
        });

        it('A valid directory path is given - 3', function (done) {
            sanity.directoryExists(__dirname + '/../../', function(err) {
                if (err) done(err);
                else done();
            });
        });
    });

    describe('directoryExists Sanity Tests - Invalid inputs', function () {
        // Set timeout of 15000 ms as by default it is 2000 ms
        this.timeout(15000);
        it('An invalid directory path is given', function (done) {
            sanity.directoryExists(__dirname + '/sanity.js', function(err) {
                if (err) done();
                else done("It should have failed since provided path is not a valid directory");
            });
        });

        it('An invalid directory path is given - 2', function (done) {
            sanity.directoryExists(__dirname + '/../test.js', function(err) {
                if (err) done();
                else done("It should have failed since provided path is not a valid directory");
            });
        });

        it('An invalid directory path is given - 3', function (done) {
            sanity.directoryExists(__dirname + '/../../package.json', function(err) {
                if (err) done();
                else done("It should have failed since provided path is not a valid directory");
            });
        });
    });

    describe('fileExists Sanity Tests - Valid inputs', function () {
        // Set timeout of 15000 ms as by default it is 2000 ms
        this.timeout(15000);
        it('A valid file path is given', function (done) {
            sanity.fileExists(__dirname + '/sanity.js', function(err) {
                if (err) done(err);
                else done();
            });
        });

        it('A valid file path is given - 2', function (done) {
            sanity.fileExists(__dirname + '/utils.js', function(err) {
                if (err) done(err);
                else done();
            });
        });

        it('A valid file path is given - 3', function (done) {
            sanity.fileExists(__dirname + '/validation.js', function(err) {
                if (err) done(err);
                else done();
            });
        });
    });

    describe('fileExists Sanity Tests - Invalid inputs', function () {
        // Set timeout of 15000 ms as by default it is 2000 ms
        this.timeout(15000);
        it('An invalid file path is given', function (done) {
            sanity.fileExists(__dirname, function(err) {
                if (err) done();
                else done("It should have failed since provided path is not a valid file path");
            });
        });

        it('An invalid file path is given - 2', function (done) {
            sanity.fileExists(__dirname + '/../../', function(err) {
                if (err) done();
                else done("It should have failed since provided path is not a valid file path");
            });
        });

        it('An invalid file path is given - 3', function (done) {
            sanity.fileExists(__dirname + '/../', function(err) {
                if (err) done();
                else done("It should have failed since provided path is not a valid file path");
            });
        });
    });
});
