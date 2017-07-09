// System includes
var EVENTS              = require('events'),
    FS                  = require('fs'),
    NODE_UTIL           = require('util');

// Local includes
var CACHE_MANAGER       = require(__dirname + '/../cache/cacheManager.js'),
    CONSTANTS           = require(__dirname + '/../utils/constants.js'),
    SANITY_TESTS        = require(__dirname + '/../utils/sanity.js'),
    UTILS               = require(__dirname + '/../utils/utils.js'),
    VALIDATION_UTILS    = require(__dirname + '/../utils/validation.js');

function TagsManager(config, options) {
    if (!config || !options || !options['tags'] ||
        !VALIDATION_UTILS.isArray(options['tags'])) {
        console.error('TagsManager.constructor::Bad params');

        process.exit(1);
    }

    EVENTS.EventEmitter.call(this);

    this._config             = config;

    this._options            = options || {};
    this._logger             = this._options['logger'];

    this._cacheManager       = new CACHE_MANAGER(this._config, this._options);

    // Path to data directory
    this._dataDirectory      = this._config['DATA_FILES_DIR'] || (__dirname + '/../data/');

    this._tagsToSearch       = this._options['tags'] || [];

    this._tagsDictionary     = { 'case_sensitive' : {}, 'case_insensitive' : {} };
    this._tagValues          = [];

    this._isIgnoreCase       = this._options['isIgnoreCase'] || false;
}

NODE_UTIL.inherits(TagsManager, EVENTS.EventEmitter);

/**
 * Start processing the tags
 */
TagsManager.prototype.processTags                       = function () {
    var self = this;
    
    this._init(function(err) {
        if (err) {
            self._log('error', {
                msg     : 'TagsManager.processTags::Error occured during initialization',
                error   : err
            });

            // Emit error event
            self.emit('error', err);
        } else {
            self._log('debug', {
                msg : 'TagsManager.processTags::Successfully initialized tags manager' 
            });

            // Emit start event
            self.emit('start');

            // Let us search the required tags
            self._searchTags(function(err, result) {
                if (err) {
                    self._log('error', {
                        msg     : 'TagsManager.processTags::Error occured while searching the tags',
                        error   : err
                    });

                    // Emit error event
                    self.emit('error', err);
                } else {
                    // Invoked the callback with result
                    self._log('debug', {
                        msg : 'TagsManager.processTags::Successfully fetched tags frequency'
                    });

                    // Let us invoke the endprocess for clean up
                    self._endProcess(function(err) {
                        // Emit end event
                        self.emit('end', result);
                    });
                }
            });
        }
    });
};

/**
 * Initializes the cache manager or any other dependency
 * that might get added in future
 * 
 * @param  {Function} cb : Callback is invoked once cache manager is initialized
 * 
 */
TagsManager.prototype._init                             = function (cb) {
    var self = this;

    this._cacheManager.init(function(err) {
        if (err) {
            self._log('debug', {
                msg     : 'TagsManager._init::Error occured while initializing the cache manager',
                error   : err
            }); 
        }

        // no worries cache is just to aid, so let us invoke the callback without error
        if (cb) cb();
    });
};

/**
 * Given an object, it adds the required values based on KEY_TO_CHECK to dictionary
 * This facilitates constant time look up
 * 
 * @param  {[Object]} inputObject : Object that needs to be checked for creating dictionary
 * @param  {[String]} values      : List of strings that are values of keys which needs to be checked
 * 
 */
TagsManager.prototype._populateTags                     = function (inputObject, values) {
    var self = this;

    if (inputObject && VALIDATION_UTILS.isStrictObject(inputObject)) {
        for (var key in inputObject) {
            if (key === CONSTANTS.KEY_TO_CHECK) {
                self._getTagValues(inputObject[key], values)
            } else {
                if (VALIDATION_UTILS.isArray(inputObject[key])) {
                    (inputObject[key] || []).forEach(function(subValue) {
                        self._populateTags(subValue, values);
                    });
                } else if (VALIDATION_UTILS.isStrictObject(inputObject[key])) {
                    self._populateTags(inputObject[key], values);
                }
            }
        }
    } else if (inputObject && VALIDATION_UTILS.isArray(inputObject)) {
        (inputObject || []).forEach(function(subValue) {
            self._populateTags(subValue, values);
        });
    }
};

/**
 * This method is responsible for fetching values of the tags
 * 
 * @param  {[type]} valObj : Object that potentially contains the value
 * @param  {[type]} values : List of values
 * 
 */
TagsManager.prototype._getTagValues                     = function (valObj, values) {
    var self = this;

    if (VALIDATION_UTILS.isString(valObj)) {
        values.push(valObj);
    } else if (VALIDATION_UTILS.isArray(valObj)) {
        (valObj || []).forEach(function(value) {
            self._getTagValues(value, values);
        });
    } else if (VALIDATION_UTILS.isStrictObject(valObj)) {
        var subKeys = Object.keys(valObj);
        (subKeys || []).forEach(function(subKey) {
            self._getTagValues(valObj[subKey], values);
        });
    }
};

/**
 * Reads the JSON files and creates a dictionary for constant time look up
 * 
 * @param  {Function} cb : Callback which gets invoked once 
 * JSON files are read and tags dictionary is created for constant time look up
 * 
 */
TagsManager.prototype._readDirectory                    = function(cb) {
    var self = this;

    // Read all the files in that directory if those are valid JSONs
    FS.readdir(this._dataDirectory, function(err, fileNames) {
        if (err) {
            self._log('error', {
                msg     : 'TagsManager._readDirectory::Error occured while reading the data directory',
                error   : err
            });

            // Let us invoke the callback with error
            if (cb) cb(err);
        } else {
            var totalFilesCount     = (fileNames || []).length,
                processedFilesCount = 0;

            // It would have been better to use promise here but requirement is to use callbacks
            // It has been explicitly mentioned not to use promises
            if (totalFilesCount === 0) {
                if (cb) cb(null);
            } else {
                (fileNames || []).forEach(function(fileName) {
                    FS.readFile(self._dataDirectory + fileName, 'utf8', function(err, data) {
                        // Increment the processed file count
                        processedFilesCount++;
                        if (err) {
                            // If it is directory then log in debug
                            if (err.code === 'EISDIR') {
                                self._log('debug', {
                                    msg     : 'TagsManager._readDirectory::Trying to read sub directory',
                                    file    : self._dataDirectory + fileName,
                                    error   : err
                                });
                            } else {
                                self._log('error', {
                                    msg     : 'TagsManager._readDirectory::Error occured while reading the file in data directory',
                                    file    : self._dataDirectory + fileName,
                                    error   : err
                                });
                            }
                        } else {
                            // Check if the file is a valid JSON
                            var jsonData = UTILS.toJSON(data);
                            if (jsonData) {
                                self._populateTags(jsonData, self._tagValues);
                            } else {
                                self._log('error', {
                                    msg     : 'TagsManager._readDirectory::Invalid JSON file in data directory',
                                    file    : self._dataDirectory + fileName
                                });
                            }
                        }

                        if (processedFilesCount === totalFilesCount) {
                            // Let us populate tags dictionary
                            self._populateTagsDictionary();
                            
                            // Let us invoke the callback
                            if (cb) cb(null);
                        }
                    });
                });
            }
        }
    });
};

/**
 * This method is responsible for searching the user specified(or default) tags
 * 
 * @param  {Function} cb : In case of success this callback is invoked with tags result
 * In case of error it is invoked with error
 * 
 */
TagsManager.prototype._searchTags                       = function(cb) {
    var self = this;
    var result = {};

    if (this._cacheManager && this._cacheManager.isCacheUptoDate()) {
        self._log('debug', {
            msg   : 'TagsManager._searchTags::Cache is upto date. It will fetch tags from cache'
        });

        this._cacheManager.searchTags(this._tagsToSearch, this._isIgnoreCase, cb);
    } else {
        // Let us read the data files and build in-memory structures
        self._readDirectory(function(err) {
            if (err) {
                self._log('error', {
                    msg   : 'TagsManager._searchTags::Error while reading data files',
                    error : err
                });

                // Let us invoke the callback with error
                if (cb) cb(err);
            } else {
                // Let us update the contents cache for subsequent uses
                self._cacheManager.updateCacheContents(self._tagsDictionary, function(err) {
                    if (err) {
                        self._log('error', {
                            msg   : 'TagsManager._searchTags::Error while updating the cache contents files',
                            error : err
                        });
                    }

                    if (VALIDATION_UTILS.isArray(self._tagsToSearch) &&
                        self._tagsToSearch.length > 0) {

                        (self._tagsToSearch || []).forEach(function(searchTag) {
                            if (searchTag) {
                                result[searchTag] = result[searchTag] || 0;

                                if (self._isIgnoreCase && (self._tagsDictionary['case_insensitive']) &&
                                    (searchTag.toUpperCase() in self._tagsDictionary['case_insensitive']))
                                    result[searchTag] = self._tagsDictionary['case_insensitive'][searchTag.toUpperCase()];
                                else if (!self._isIgnoreCase && (self._tagsDictionary['case_sensitive']) &&
                                    (searchTag in self._tagsDictionary['case_sensitive']))
                                    result[searchTag] = self._tagsDictionary['case_sensitive'][searchTag];
                            }
                        });

                        // Since cache is just for aid we invoke the callback with results without error
                        if (cb) cb(null, result);
                    } else {
                        if (cb) cb('TagsManager._searchTags::No tags specified to be searched');
                    }
                });
            } 
        });
    }
};

/**
 * Populates the tags dictionary for tags list
 */
TagsManager.prototype._populateTagsDictionary           = function() {
    var self            = this,
        uppercaseValue  = null;

    (this._tagValues || []).forEach(function(value) {
        self._tagsDictionary['case_sensitive'][value] = (self._tagsDictionary['case_sensitive'][value] || 0) + 1;

        uppercaseValue = value.toUpperCase();

        // Add values for case insensitive search as well
        self._tagsDictionary['case_insensitive'][uppercaseValue] = (self._tagsDictionary['case_insensitive'][uppercaseValue] || 0) + 1;
    });
};

/**
 * Do the necessary clean up
 * @param  {Function} cb : Callback is invoked after the clean up
 */
TagsManager.prototype._endProcess                       = function (cb) {
    // Let us clear in-memory objects
    this._tagValues      = null;
    this._tagsDictionary = null;

    if (cb) cb(null);
};

/**
 * Log the emssage based on level
 * 
 * @param  {String} level : Log level like debug, info, warn and error 
 * @param  {String} msg   : Message object that needs to be logged 
 */
TagsManager.prototype._log                              = function (level, msg) {
    if (this._logger && this._logger[level])
        this._logger[level](msg);
};

exports = module.exports = TagsManager;