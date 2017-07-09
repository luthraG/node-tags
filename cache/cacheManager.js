// System includes
var FS                  = require('fs'),
    PATH                = require('path');

// Local includes
var CONSTANTS           = require(__dirname + '/../utils/constants.js'),
    SANITY_TESTS        = require(__dirname + '/../utils/sanity.js'),
    UTILS               = require(__dirname + '/../utils/utils.js'),
    VALIDATION_UTILS    = require(__dirname + '/../utils/validation.js');

function CacheManager(config, options) {
    if (!config || !options) {
        console.error('CacheManager.constructor::Bad params');

        process.exit(1);
    }

    this._config             = config;

    this._options            = options || {};
    this._logger             = this._options['logger'];

    // Path to data directory
    this._dataDirectory      = this._config['DATA_FILES_DIR'] || (__dirname + '/../../data/');

    // Path to cache data directory
    this._cacheDataDirectory = this._config['CACHE_FILES_DIR'] || (__dirname + '/../data/');

    this._tagsDictionary     = {};

    // Contains meta information about data jsons based on current state
    this._currentStat        = {};

    // Contains meta information about data jsons based on previously stored state
    this._previousStat       = {};

    // Boolean to indicate if cache is latest and can be used to serve requests
    this._isCacheFresh       = false;
}

/**
 * Initializes the cache manager where it
 * 1. reads the meta data and checks if cache is fresh or not
 * 2. In case cache is stale then it updates the meta data and invokes the callback
 * 3. In case cache is fresh, it sets the member variable to indicate the same that cache can be used to server data
 *
 * 
 * @param  {Function} cb : Callback that gets invoked once initialization is complete or with error
 */
CacheManager.prototype.init                             = function(cb) {
    var self = this;

    // First read the cache meta to check the previous stats
    this._readCacheMeta(function(err) {
        if (err) {
            self._log('debug', {
                msg     : 'CacheManager.init::Error occured while reading the cache meta file',
                error   : err
            });

            // Since cache is just to help speed up, so lets us move on
            if (cb) cb(null);
        } else {
            // Let us check current stats
            self._readDataDirectory(function(err) {
                if (err) {
                    self._log('debug', {
                        msg     : 'CacheManager.init::Error occured while reading the data files to check current stats',
                        error   : err
                    });

                    // Since cache is just to help speed up, so lets us move on
                    if (cb) cb(null);
                } else {
                    // We got both current stats and previous stats, Let us check if both are same
                    if (VALIDATION_UTILS.objectEquals(self._previousStat, self._currentStat)) {
                        // Let us read tags information in memory & invoke the callback
                        self._readCacheContents(function(err) {
                            if (!err) {
                                self._log('debug', {
                                    msg     : 'CacheManager.init::Sucessfully read cache data in memory'
                                });

                                // Set the cache fresh to true
                                self._isCacheFresh = true;
                            }

                            // Regardless of error we invoke the callback as cache is just to help
                            if (cb) cb(null);
                        });
                    } else {
                        // These are not same. Let us update the cache meta & invoke the callback
                        self._updateCacheMeta(function(err) {
                            if (!err) {
                                self._log('debug', {
                                    msg     : 'CacheManager.init::Sucessfully updated cache metadata'
                                });
                            }

                            // Regardless of error we invoke the callback as cache is just to help
                            if (cb) cb(null);
                        });
                    }
                }
            });
        }
    });
};

/**
 * Checks if cache is updated or stale
 * 
 * @return {Boolean} : Returns a boolean value to indicate the cache is fresh or stale
 */
CacheManager.prototype.isCacheUptoDate                  = function() {
    return this._isCacheFresh;
};

/**
 * Search the tags frequency in the dictionary
 * @param  {[String]}   tags       List of tags to be searched
 * @param  {[Boolean]}  ignoreCase Boolean value indicating if case insensitive search is required
 * @param  {Function}   cb         Callback that must be invoked in case of success or error
 */
CacheManager.prototype.searchTags                       = function(tags, ignoreCase, cb) {
    var self = this;
    var result = {};

    if (this._isCacheFresh && VALIDATION_UTILS.isArray(tags) && tags.length > 0) {
        (tags || []).forEach(function(searchTag) {
            if (searchTag) {
                result[searchTag] = result[searchTag] || 0;

                if (!ignoreCase && (self._tagsDictionary['case_sensitive']) &&
                    (searchTag in self._tagsDictionary['case_sensitive']))
                    result[searchTag] = self._tagsDictionary['case_sensitive'][searchTag];
                else if (ignoreCase && (self._tagsDictionary['case_insensitive']) &&
                    (searchTag.toUpperCase() in self._tagsDictionary['case_insensitive']))
                    result[searchTag] = self._tagsDictionary['case_insensitive'][searchTag.toUpperCase()];
            }
        });

        // Let us invoke the callback
        if (cb) cb(null, result);
    } else {
        // Since cache is just for speeding up
        if (cb) cb(null);
    }
}

/**
 * Updates the cache contents if source files has been changed
 * @param  {[type]}   tagsDictionary Updated tags dictionary that must be cached
 * @param  {Function} cb             Callback method that must be invoked in case of success or error
 */
CacheManager.prototype.updateCacheContents              = function(tagsDictionary, cb) {
    var contentsFilePath = this._cacheContentsPath();

    if (tagsDictionary && VALIDATION_UTILS.isJSON(tagsDictionary))
        FS.writeFile(contentsFilePath, JSON.stringify(tagsDictionary), 'utf8', function(err) {
            if (err) {
                self._log('debug', {
                    msg     : 'CacheManager.updateCacheContents::Error while updating cache contents',
                    error   : err
                });    
            }

            // Regardless of error we invoke the callback as cache is just to help
            if (cb) cb(null);
        });
    else
        if (cb) cb(null);
};

/**
 * Updates the meta data file of cache
 * @param  {Function} cb Callback that must be invoked in case of success or error
 */
CacheManager.prototype._updateCacheMeta                 = function(cb) {
    var metaFilePath    = this._cacheMetaPath();

    if (this._currentStat && VALIDATION_UTILS.isJSON(this._currentStat))
        FS.writeFile(metaFilePath, JSON.stringify(this._currentStat), 'utf8', function(err) {
            if (err) {
                self._log('debug', {
                    msg     : 'CacheManager._updateCacheMeta::Error while updating cache metadata',
                    error   : err
                });    
            }

            // Regardless of error we invoke the callback as cache is just to help
            if (cb) cb(null);
        });
    else
        if (cb) cb(null);
};

/**
 * Reads the cache meta file and populates the in memeory structure
 * @param  {Function} cb Callback that must be invoked in case of success or error
 */
CacheManager.prototype._readCacheMeta                   = function(cb) {
    var self            = this,
        metaFilePath    = this._cacheMetaPath();

    FS.readFile(metaFilePath, 'utf8', function(err, data) {
        if (err) {
            self._log('debug', {
                msg     : 'CacheManager._readCacheMeta::Error occured while reading the cache meta file',
                error   : err
            });

            // Set previous stats to {}
            self._previousStat = {};

            // Invoke callback without error as caching is just to aid
            if (cb) cb (null);
        } else {
            try {
                self._previousStat = JSON.parse(data);
            } catch (e) {
                self._log('debug', {
                    msg     : 'CacheManager._readCacheMeta::Exception occured while parsing the cache metadata',
                    error   : e
                });

                // Set previous stats to {}
                self._previousStat = {};
            }

            if (cb) cb(null);
        }
    });
};

/**
 * Reads the cache content file and builds in memory structure
 * @param  {Function} cb Callback method that must be invoked in case of success or error
 */
CacheManager.prototype._readCacheContents               = function(cb) {
    var self                = this,
        contentsFilePath    = this._cacheContentsPath();

    FS.readFile(contentsFilePath, 'utf8', function(err, data) {
        if (err) {
            self._log('debug', {
                msg     : 'CacheManager._readCacheContents::Error occured while reading the cache contents file',
                error   : err
            });

            // Set tags dictionary to {}
            self._tagsDictionary = {};

            // Invoke callback without error as caching is just to aid
            if (cb) cb (null);
        } else {
            try {
                self._tagsDictionary = JSON.parse(data);
            } catch (e) {
                self._log('debug', {
                    msg     : 'CacheManager._readCacheContents::Exception occured while parsing the cache contents',
                    error   : e
                });

                // Set tags dictionary to {}
                self._tagsDictionary = {};
            }

            if (cb) cb(null);
        }
    });
};

/**
 * Reads the data files and builds the cache meta file
 * @param  {Function} cb Callback method that must be invoked in case of success or error
 */
CacheManager.prototype._readDataDirectory               = function(cb) {
    var self = this;

    // Check if data directory exists
    SANITY_TESTS.directoryExists(this._dataDirectory, function(err) {
        if (err) {
            self._log('debug', {
                msg     : 'CacheManager._readDataDirectory::Error occured while checking if data directory exists',
                error   : err
            });

            // Let us invoke the callback with error
            cb(err);
        } else {
            // Read all the files in that directory and check if anything has changed so that we can update the cache
            FS.readdir(self._dataDirectory, function(err, fileNames) {
                if (err) {
                    self._log('debug', {
                        msg     : 'CacheManager._readDataDirectory::Error occured while reading the data directory',
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
                            FS.stat(self._dataDirectory + fileName, function(err, stats) {
                                // Increment the processed file count
                                processedFilesCount++;
                                if (err) {
                                    self._log('debug', {
                                        msg     : 'CacheManager._readDataDirectory::Error occured while checking the file stats in data directory',
                                        file    : self._dataDirectory + fileName,
                                        error   : err
                                    }); 
                                } else {
                                    if (stats.isFile()) {
                                        self._currentStat[fileName] = self._currentStat[fileName] || {
                                            size    : 0,
                                            mtimeMs : 0
                                        };

                                        self._currentStat[fileName]['size']     = (stats && stats.size) ? stats.size : 0;
                                        self._currentStat[fileName]['mtimeMs']  = (stats && stats.mtime) ? new Date(stats.mtime).getTime() : 0;
                                    }
                                }

                                if (processedFilesCount === totalFilesCount)
                                    if (cb) cb(null);
                            });
                        });
                    }
                }
            });
        }
    });
};

/**
 * Returns the path of cache contents file
 * @return {[String]} Path to cache contents file
 */
CacheManager.prototype._cacheContentsPath               = function() {
    return PATH.join(this._cacheDataDirectory, UTILS.sha1(CONSTANTS.TAGS_SEARCH) + '.contents');
};

/**
 * Returns the path of meta file for cache
 * @return {[String]} Path to metadata file
 */
CacheManager.prototype._cacheMetaPath                   = function() {
    return PATH.join(this._cacheDataDirectory, UTILS.sha1(CONSTANTS.TAGS_SEARCH) + '.meta');
};

/**
 * Log the emssage based on level
 * 
 * @param  {String} level : Log level like debug, info, warn and error 
 * @param  {String} msg   : Message object that needs to be logged 
 */
CacheManager.prototype._log                              = function (level, msg) {
    if (this._logger && this._logger[level])
        this._logger[level](msg);
};

exports = module.exports = CacheManager;