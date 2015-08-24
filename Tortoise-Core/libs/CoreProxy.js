// This is a proxy to discover the file system info ... shh :)

var path = "";

var CoreProxy = 
{  
    getDirName  : function()
    {
        return (__dirname);
    }
};

module.exports.CoreProxy = CoreProxy;
