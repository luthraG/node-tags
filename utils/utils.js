//
// Miscellaneous utils
//
// Local Incudes
var VALIDATION_UTILS    = require(__dirname + '/validation.js');

// System Includes
var CRYPTO              = require('crypto'),
    OS                  = require('os');

var Utils = {
    
    /**
     * Given an object, it clones the object
     * only one of inclusionList, exclusionList, shallowList can be specified for now
     * 
     * @param  {[Object]} obj           : object to clone
     * @param  {[String]} inclusionList : list of (first level) keys to includes
     * @param  {[String]} exclusionList : list of (first level) keys to exclude
     * @param  {[String]} shallowList   : list of (first level) keys to shallow include
     * @return {[Object]}               : Returns cloned object
     */
    clone          : function(obj, inclusionList, exclusionList, shallowList) {
        if (!inclusionList && !exclusionList && !shallowList)
            // Do the hoaky stuff below to take care of JSON not supporting 'Infinity' as value for Number
            return JSON.parse(
                JSON.stringify(
                    obj, this._convertInfinityToString
                ),
                this._convertStringToInfinity
            );

        // Can only specify 1 param for now
        if ((inclusionList && exclusionList) || (inclusionList && shallowList) || (exclusionList && shallowList))
            throw new Error('Bad params');

        inclusionList = inclusionList || [];
        exclusionList = exclusionList || [];
        shallowList   = shallowList   || [];

        if (inclusionList) {
            var tmp = {};
            inclusionList.forEach(function(include) {
                tmp[include] = obj[include];
            });
            return JSON.parse(JSON.stringify(tmp, this._convertInfinityToString), this._convertStringToInfinity);
        }

        if (exclusionList) {
            var bak = {};
            exclusionList.forEach(function(exclude) {
                bak[exclude] = obj[exclude];
                delete obj[exclude];
            });
            var clone = JSON.parse(JSON.stringify(obj, this._convertInfinityToString), this._convertStringToInfinity);

            // Copy over the keys from back up into the original
            exclusionList.forEach(function(exclude) {
                obj[exclude] = bak[exclude];
                delete bak[exclude];
            });

            return clone;
        }

        if (shallowList) {
            // Backup the shallow keys and delete from original temporarily
            var bak = {};
            shallowList.forEach(function(shallow) {
                bak[shallow] = obj[shallow];
                delete obj[shallow];
            });

            // Clone the ones that require deep copying
            var clone = JSON.parse(JSON.stringify(obj, this._convertInfinityToString), this._convertStringToInfinity);

            // Copy over the shallow keys from back to clone and back into the original
            shallowList.forEach(function(shallow) {
                clone[shallow] = bak[shallow];
                obj[shallow]   = bak[shallow];

                delete bak[shallow];
            });

            // Return the clone
            return clone;
        }
        
        // Should never come here
        throw new Error('Utils.clone::Why am I here?');
    },

    // Do the hoaky stuff below to take care of JSON not supporting 'Infinity' as value for Number
    _convertInfinityToString    : function(key, value) {
        return (value === Infinity) ? 'GL_Infinity' : value;
    },

    // Do the hoaky stuff below to take care of JSON not supporting 'Infinity' as value for Number
    _convertStringToInfinity    : function(key, value) {
        return (value === 'GL_Infinity') ? Infinity : value;
    },

    /**
     * Give a string it returns the SHA1 value
     * @param  {[String]} data : String for which sha needs to be computed
     * @return {[String]}      : Returns the has value for the specified string 
     */
    sha1            : function(data) {
        var sha1 = CRYPTO.createHash('sha1');
        sha1.update(data);
        return sha1.digest('hex');
    },

    /**
     * Checks if underlying platform is windows
     * @return {Boolean} : Returns true if underlying platform is windows
     */
    isWindows       : function() {
        var platform = OS.platform();
        return platform === 'win32'  ||
               platform === 'cygwin' ||
               platform === 'msys' ;
    },

    /**
     * Checks if underlying platform is linux
     * @return {Boolean} : Returns true if underlying platform is linux
     */
    isLinux         : function() {
        var platform = OS.platform();
        return platform === 'linux';
    },

    /**
     * Checks if underlying platform is macOS
     * @return {Boolean} : Returns true if underlying platform is macOS
     */
    isMac           : function() {
        var platform = OS.platform();
        return platform === 'darwin';
    },

    /**
     * Get the new line character based on underlying platform
     * @return {[type]} : Returns new line character
     */
    getNewLine      : function() {
        if (this.isLinux() || this.isMac())
            return "\n";
        else if(this.isWindows())
            return "\r\n";
        else
            return "\n";
    },

    /**
     * Converts a JSON string or an object to JSON object
     * @param  {[Object/String]} value : Value that needs to be converted to JSON object
     * @return {[type]}                : Returns the JSON object in case of success or null in case of error
     */
    toJSON          : function(value) {
        try {
            if (VALIDATION_UTILS.isString(value)) {
                var json = JSON.parse(value);
                return ((typeof json) === 'object') ? json : null;
            }
            else if(typeof value === 'object' && value !== null && VALIDATION_UTILS.isNaN(value)) {
                var json = JSON.parse(JSON.stringify(value));
                return (typeof json === 'object') ? json : null;
            }
        } catch(e) {
            return null
        }
    },

    /**
     * Given an object, returns sorted object on its values
     * @param  {[type]} obj : Object to be sorted on values
     * @return {[type]}     : Returns sorted object on the values 
     */
    sortObject      : function(obj) {
        var out = {};
        if (obj && VALIDATION_UTILS.isStrictObject(obj)) {
            var sortable = [];
            for (var key in obj)
                sortable.push([key, obj[key]]);

            sortable.sort(function(a, b) {return b[1] - a[1]});

            (sortable || []).forEach(function(sortValue) {
                out[sortValue[0]] = sortValue[1];
            });
        }

        return out;
    },

    /**
     * Given an object, returns sorted arrays on object values
     * @param  {[type]} obj : Object to be sorted on values
     * @return {[type]}     : Returns sorted array on the values
     */
    sortObjectToArray   : function(obj) {
        var sortable = [];
        if (obj && VALIDATION_UTILS.isStrictObject(obj)) {
            for (var key in obj)
                sortable.push([key, obj[key]]);

            sortable.sort(function(a, b) {return b[1] - a[1]});
        }

        return sortable;
    }
};

exports = module.exports = Utils;