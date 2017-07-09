// System imports
var FS               = require('fs'),
    PATH             = require('path');

// Local imports
var LOGGER           = require(__dirname + '/../utils/logger.js'),
    SANITY_TESTS     = require(__dirname + '/../utils/sanity.js'),
    TAGS_MANAGER     = require(__dirname + '/tagsManager.js'),    
    UTILS            = require(__dirname + '/../utils/utils.js'),
    VALIDATION_UTILS = require(__dirname + '/../utils/validation.js');

/**
 * This is entry point of process
 *
 * It first parses the CLI arguments and
 * start finding the tags frequency
 * 
 */
(function startProcess() {
    //
    // Read the command line parameters
    //
    var myArgs          = process.argv.slice(2),
        configPath      = __dirname + '/../conf/appConf.js'
        isIgnoreCase    = false;

    // If path to configuration is specified
    if (myArgs && myArgs.indexOf("-c") != -1) {
        configPath = myArgs[myArgs.indexOf("-c") + 1];
    }

    // If case-insensitive check flag added
    if (myArgs && myArgs.indexOf("-i") != -1) {
        isIgnoreCase = true;
    }

    // Get the tags
    getTags(myArgs, function(err, tags) {
        if (err) {
            console.error('Error while fetching the tags : ' + err);
            console.log('Usage: node source/driver.js -t <tag1>,<tag2>,...,<tagN> -c <path_to_configuration file>');

            // Let us exit
            process.exit(-1);
        } else {
            // We got the tags, Let us do the sanity checks

            // 1. Check if config file exists
            confValidator(configPath, function(err) {
                if (err) {
                    console.error('Error while validating the configuration file path : ' + err);

                    // Let us exit
                    process.exit(-1);
                } else {
                    var CONF = require(configPath);

                    var  logger = LOGGER.createLogger(CONF['LOGGER'], 'NODE_TAGS');

                    logger.debug({
                        msg  : 'Driver:Configuration used',
                        conf : CONF
                    });

                    // 2. Check if data directory exists
                    SANITY_TESTS.directoryExists(CONF['DATA_FILES_DIR'], function(err) {
                        if (err) {
                            self._log('error', {
                                msg     : 'Driver._init::Error occured while checking if data directory exists',
                                error   : err
                            });

                            // Let us exit
                            process.exit(-1);
                        } else {
                            var startProcess;

                            // Let us start tags processing
                            var tagsManager = new TAGS_MANAGER(CONF, {
                                logger          : logger,
                                tags            : tags,
                                isIgnoreCase    : isIgnoreCase
                            });
                            
                            // Add start event listener
                            tagsManager.on('start', function() {
                                logger.debug({
                                    msg : 'Driver::Started tags processing'
                                });

                                startProcess = Date.now();
                            });

                            // Add end event listener
                            tagsManager.on('end',   function(data) {
                                logger.info({
                                    msg         : 'Driver::Finished tags processing',
                                    result      : UTILS.sortObject(data),       // Return the sorted results
                                    timeTakenMS : (Date.now() - startProcess)
                                });

                                // Let us exit the process
                                process.exit(0);
                            });

                            // Add error event listener
                            tagsManager.on('error',   function(err) {
                                logger.error({
                                    msg     : 'Driver::Error happened while processing tags',
                                    error   : err
                                });

                                // Let us exit the process
                                process.exit(-1);
                            });

                            tagsManager.processTags();
                        }
                    });
                }
            })
        }
    });  
})();

/**
 *
 * Based on CLI argument it fetches the tags
 * If no tags have been specified then it uses the default tags
 * 
 * @param  {[String]} : Array of CLI arguments 
 * @param  {Function} : Callback method
 * @return {[string]} : Invoke the callback, either with error or Array of tags
 */
function getTags(args, cb) {
    var tags = null;

    // If tags are specified
    if (args && args.indexOf("-t") != -1)
        tags = args[args.indexOf("-t") + 1];

    // First ensure that tags field contains string
    if (VALIDATION_UTILS.isString(tags))
        tags = tags ? (tags || '').split(',') : []; // Since these are comma separated, hence split it on comma

    // Atleast one tag is be not null/empty
    if (VALIDATION_UTILS.isArray(tags) && tags.length > 0 &&
        VALIDATION_UTILS.containsNotNull(tags)) {
        if (cb) cb(null, tags);
    } else {
        // Read the default tags
        var tagsFile = PATH.join(__dirname, 'tags.txt');
        FS.readFile(tagsFile, 'utf8', function(err, data) {
            if (err) {
                if (cb) cb (err);
            } else {
                // Check the platform and then use line feed character 
                tags = (data || '').split(UTILS.getNewLine());
                
                // If last element is empty string then remove it
                if (tags && VALIDATION_UTILS.isEmpty(tags[tags.length - 1]))
                    tags = tags.slice(0, tags.length - 1);

                if (cb) cb(null, tags);
            }
        });   
    }
}

/**
 * Given the path of configuration file, it checks if file exists or not
 * 
 * This is part of sanity check
 * 
 * @param {String} : Path of configuration file
 * @param {Function} : Callback method which gets invoked with the error
 * if file does not exists at specified path
 */
function confValidator(path, cb) {
    var parsedPath = PATH.parse(path);
    if (parsedPath.dir !== __dirname + '/../conf')
        path = __dirname + '/../conf/' + parsedPath.base;

    SANITY_TESTS.fileExists(path, cb);
}

/**
 * uncaughtException event listener
 */
process.on('uncaughtException', function(e) {
    console.error({ msg:'THIS IS REALLY BAD::Encountered uncaught exception ', stack : e.stack});

    // Let us exit the process
    process.exit(1);
});