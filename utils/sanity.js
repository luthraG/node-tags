// System Imports
var FS          = require('fs');

var SanityTest  = {

    /**
     * Check if directory exists at specified path
     * @param  {[String]} directoryPath  : Directory path which needs to be checked
     * @param  {Function} cb             : Call method which is invoke once there is error or check is complete
     */
    directoryExists  : function (directoryPath, cb) {
        FS.stat(directoryPath, function (err, stats) {
            if (err)
                cb('Error sanity testing path ' + directoryPath + ' , Err :: ' + err);
            else if (!stats.isDirectory())
                cb('Error sanity testing path ' + directoryPath + ' , Err :: Provided path is not a directory');
            else
                cb(null);
        });
    },

    /**
     * Check if file exists at specified path
     * @param  {[String]} filePath : File path which needs to be checked
     * @param  {Function} cb       : Call method which is invoke once there is error or check is complete
     */
    fileExists       : function (filePath, cb) {
        FS.stat(filePath, function (err,stats) {
            if (err)
                cb('Error sanity testing file ' + filePath + ' , Err :: ' + err);
            else if (!stats.isFile())
                cb('Error sanity testing file ' + filePath + ' , Err :: No such file');
            else
                cb(null);
        });
    }
};

exports = module.exports = SanityTest;
