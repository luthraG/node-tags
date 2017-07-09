var CONF = {

    /**
     * [LOGGER object description]
     * @type {Object}
     */
    LOGGER          : {
        SPACE       : 4,
        VERBOSE     : false
    },

    /**
     * [DATA_FILES_DIR : Directory where data files are present]
     * @type {string}
     */
    DATA_FILES_DIR  : __dirname + '/data/',

    /**
     * [CACHE_FILES_DIR : Directory where cache files(cache and its meta) are present]
     * @type {[type]}
     */
    CACHE_FILES_DIR : __dirname + '/cache/data/' 
};

exports = module.exports = CONF;