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
    DATA_FILES_DIR  : __dirname + '/../data/',

    /**
     * [CACHE_FILES_DIR : Directory where cache files(cache and its meta) are present]
     * @type {[type]}
     */
    CACHE_FILES_DIR : __dirname + '/../cache/data/' 
};

// Allow environment variables to override values in the config file.
for (env in process.env) {
    if (env.match(/^zi_nodetags_/))
        CONF[env.replace(/^zi_nodetags_/, '')] = process.env[env];
}

exports = module.exports = CONF;