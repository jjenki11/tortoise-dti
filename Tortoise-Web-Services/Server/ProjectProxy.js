// This is a proxy to discover the file system info ... shh :)

var path = "";

var CoreProxy = require('./CoreProxy.js').CoreProxy;


var ProjectProxy = 
{  
    getFileName : function()
    {
        return (__filename);
    },
    getDirName  : function()
    {
        return (__dirname);
    },      
    setDirName  : function(dName)
    {
        path=dName;
    },      
    printDirName : function()
    {
        console.log(path);
    },
    getCoreDirName : function()
    {
      //console.log(CoreProxy.getDirName());
      return CoreProxy.getDirName();
    },
};

module.exports.ProjectProxy = ProjectProxy;
