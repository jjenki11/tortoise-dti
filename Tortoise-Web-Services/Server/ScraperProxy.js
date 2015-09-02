// This is a proxy to scrape a directory at an interval until a list of filenames has been found ... shh :)

var path = "";
var project_path
var childProcess = require('child_process'),
  child_scraper;

var foundCounter = 0;

var asyncList = [
    

];

    function getAsyncProcess (dir)
    {
        var x = asyncList;
        for(var i = 0; i < x.length; i++)
        {
            if(x[i].id == dir)
            {
                return x[i];
            }
        }
        console.log('found nothing');
        return null;
    };
    function setAsyncProgress(dir, prog)
    {
        var x = getAsyncProcess(dir);
        for(var i = 0; i < x.length; i++)
        {
            if(x[i].id == dir)
            {
                x[i].progress = prog;
                return true;
            }
        }
        return false;
    };
    function addAsyncProcess(dir,numFiles,theType)
    {
        console.log('adding new process -> ',dir, numFiles,'files.');
        asyncList.push({progress: 0, nFiles: numFiles, id: dir, type: theType});
    };
    
    function removeAsyncProcess(dir)
    {
        var x = getAsyncProcess(dir);
        var newAsyncArray = [];
        console.log('the group name = ',dir);
        if(x){
            for(var i = 0; i < x.length; i++)
            {
                if(x[i].id == dir)
                {
                    // dont add it again
                }
                else
                {
                    newAsyncArray.push(x[i]);
                }
            }
            asyncList = newAsyncArray;
            return true;
        }
    };

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
    
    
    ScrapeDirForFiles : function(data, sock, basepath, corepath, index)
    {  
      addAsyncProcess(data.dir, data.fileArray.length, data.type);
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
            foundCounter++;
             console.log('Child process exited with exit code '+code);
             var p = getAsyncProcess(data.dir) || {id: data.dir, progress: 0, nFiles: data.fileArray.length};
             p.progress = p.progress + 1;
             setAsyncProgress(data.dir, p);
             console.log(' i = ',p,' num files = ',data.fileArray.length);
             sock.emit('progress_update', {percent_done: ((p.progress / (data.fileArray.length))*100).toFixed(2), name: 'test', bar_id: data.dir});
             // check if 100%
             if( ~~((getAsyncProcess(data.dir).progress / getAsyncProcess(data.dir).nFiles)*100) == 100 ){
                var sz = asyncList.length;
                //removeAsyncProcess(data.dir);
                //console.log('Removed the process, see?  before = ',sz, ' after = ',asyncList.length);
                if(data.type == 'template' && (sz == 0))
                {
                    //sock.emit('completed_template_progress', {task: data.dir, remaining: asyncList.length});
                }
                if(data.type == 'register' && (sz == 0))
                {
                    //sock.emit('completed_register_progress', {task: data.dir, remaining: asyncList.length});
                }
             }
          });        
      }      
      console.log('done scraping');
      foundCounter = 0;
    },
    
};

module.exports.ScraperProxy = ScraperProxy;
