/**
 * Log all the messages
 * @param  {[Object]} config object : Contains logger configuration like verbose mode, space etc.
 * @param  {[Object]} obj  : Denotes the object to be logged
 */
function log(config, obj) {
    // Add ISO time stamp to log
    if (!obj['isoTime']) {
        obj['isoTime'] = (new Date()).toISOString();
    }

    // Message should be present as msg but if you use message we will handle
    if (!obj['msg'] && obj['message']) {
        obj['msg'] = obj['message'];
        delete obj['message'];
    }

    // A log without message is of no use
    if (!obj['msg']) {
        return;
    }

    if (obj['level'] == "debug" && !config['VERBOSE']
        || obj['level'] == "info" && config['QUIET']) {
        return;
    }
    console.log(
        JSON.stringify(
            obj,
            replacer, config['SPACE']));
}

/**
 * Given the config object and app identifier, it creates the logger object
 * @param  {[Object]} config object : Contains logger configuration like verbose mode, space etc.
 * @param  {[String]} id : Denotes the app identifier
 */
function createLogger(config, id) {
    return {
        message : function(level, msg) {
            if (typeof msg == "string")
                msg = { 'msg' : msg, level: level };
            if (!msg['level']) {
                msg['level'] = level;
            }

            // Add the app identifier
            msg['app'] = id || 'NODE_TAGS';

            log(config, msg);
        },
        debug : function(msg) { this.message('debug', msg); },
        info  : function(msg) { this.message('info',  msg); },
        warn  : function(msg) { this.message('warn',  msg); },
        error : function(msg) { this.message('error', msg); }
    };
}

/**
 * Replacer method is responsible for printing Error object which is a live object
 * JSON.stringify/parse can not deal with Error object and hence replacer method provides
 * required information
 * 
 * @param  {[String]} key
 * @param  {[Object]} value 
 * @return {[Object]} returns the parsed object with relevant information
 */
function replacer(key, value) {
    if (value instanceof Error) {
        var error = {};

        Object.getOwnPropertyNames(value).forEach(function (key) {
            error[key] = value[key];
        });

        return error;
    }

    return value;
}

exports = module.exports = {
    createLogger : createLogger
};
