// This is a proxy to scrape a directory at an interval until a list of filenames has been found ... shh :)

var path = "";
var project_path
var childProcess = require('child_process'),
  child_scraper;

var foundCounter = 0;

var ScraperProxy = 
{  
    getDirName  : function()
    {
        path = (__dirname);
        return path;
    },
    setDirName  : function(dir)
    {
        path = dir;
        return path;
    },
    
    ScrapeDirForFiles : function(data, sock, basepath, corepath)
    {
        console.log('The dir you are choosing: ',data.dir);
        console.log('The files you are choosing: ', data.fileArray);
       console.log(basepath+data.dir+'/'+data.fileArray[0]);
        
      for(var i = 0; i < data.fileArray.length; i++)
      {
           child_scraper = childProcess.exec(corepath+'/watch_dir_contents.sh '+basepath+data.dir+'/'+data.fileArray[i], function (error, stdout, stderr) {
           if (error) {
             console.log(error.stack);
             console.log('Error code: '+error.code);
             console.log('Signal received: '+error.signal);
           }
           console.log('Child Process STDOUT: '+stdout);
           console.log('Child Process STDERR: '+stderr);
            
          });
          child_scraper.on('exit', function (code) {
             console.log('Child process exited with exit code '+code);
             console.log(' i = ',foundCounter++);
             sock.emit('progress_update', {percent_done: (foundCounter / data.fileArray.length)*100, name: 'test'});
          });        
      }      
      console.log('done scraping');
      foundCounter = 0;
    },
    
};

module.exports.ScraperProxy = ScraperProxy;
