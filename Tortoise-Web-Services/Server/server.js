var io = require('socket.io').listen(8444);
var ss = require('socket.io-stream');
var child = require('child_process');
var events = require('events');
var sys = require('sys');
var fs = require('fs');
var http = require('http');

var project = require('./ProjectProxy.js').ProjectProxy;

var module = require('module');

 var childProcess = require('child_process'),
     ls,
     ct,
     cp,
     rb,
     create_template,
     gxf,
     rag,
     attt,
     scrape,
     csv;
     
     
     
    var patient_subjects = [];
    var control_subjects = [];
    var atlas_subjects = [];
    
    var CoreLibsPath = project.getCoreDirName();
    
    var ProjectPath  = project.getDirName(); // Server/Projects
    var ProjectName;//  = project.getProjectName();
    
    
    
    var SceneGraphProxy = require('./SceneGraphProxy.js').SceneGraphProxy;
    
    var TortoiseProxy = require('./TortoiseProxy.js').TortoiseProxy;
    
function scene_graph_init(data,socket)
{
    console.log('well at least we are in the init function...');
    SceneGraphProxy.init(data,socket);
};
function scene_graph_update(data)
{
    console.log('well at least we are in the update function...');
    SceneGraphProxy.update(data);
};
function scene_graph_execute(data)
{
    console.log('we are in the execute function...');    
    SceneGraphProxy.update(data);
    var groups = SceneGraphProxy.getGroupNodeIDs();
    
    console.log(groups);
    var atlases = SceneGraphProxy.getAtlasNodeIDs();
    console.log(atlases);
    
    create_folder_list(groups);
    
    
};

function create_folder_list(list)
{
    child_createProject({project_name: ProjectName, folderArgs: list});
}

function child_scrape(data,socket)
{
    var ScraperProxy = require('./ScraperProxy.js').ScraperProxy;
    ScraperProxy.ScrapeDirForFiles(data, socket, ProjectName, CoreLibsPath);
    
};

function child_ls(dir)
{
 ls = childProcess.exec('ls -lsa '+dir, function (error, stdout, stderr) {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });
 ls.on('exit', function (code) {
   console.log('Child process exited with exit code '+code);
 }); 
};

var current_category = null;


function child_readCSVFile(data,socket)
{
  csv = childProcess.exec('cat '+ProjectName+'/'+data.filename, function (error, stdout, stderr) {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
    
   socket.emit('csv_response', {data: stdout});
 });

 csv.on('exit', function (code) {
   console.log('Child process exited with exit code '+code);
 });
};

function child_CombineTransformations(data)
{
  ct = childProcess.exec(CoreLibsPath+'/combine_xform_helper.sh '+ProjectName+data.src+' '+ProjectName+data.tgt+' '+ProjectName+data.out, function (error, stdout, stderr) {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });

 ct.on('exit', function (code) {
   console.log('Child process exited with exit code '+code);
 });
};

function child_ApplyTransformationToTensor(data)
{
   attt = childProcess.exec(CoreLibsPath+'/apply_trans_to_tens_helper.sh '+data.orig+' '+data.disp+' '+data.out, function (error, stdout, stderr) {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });

 attt.on('exit', function (code) {
   console.log('Child process exited with exit code '+code);
 });
};

function child_CreateTemplate(data)
{
    console.log('Creating Template...');
    console.log(data);
    console.log(ProjectName+data.path);
    // the 'y' is for yes!
    //  this fixes image mismatch due to mipav dropping a slice
    create_template = childProcess.exec('cd '+ data.exec_path+' && /raid1b/STBBapps/DTIREG/bin/dtireg_create_template_jeff '+ProjectName+data.path+' '+data.step+' '+data.exec_path+' < '+ProjectName+"answer_file.txt &", function(error, stdout, stderr) {
    if(error){
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
   console.log('template created!');
    child_GetXformFiles(data);
  
 });

 create_template.on('exit', function (code) {
   console.log('Child process create template exited with exit code '+code);
 });
     
};

function child_ROIBusiness(data)
{
   rb = childProcess.exec(CoreLibsPath+'/roi_business.sh '+data.derived_values + ' '+ProjectName+'working_atlas/roi_list.txt '+ ProjectName+'working_atlas/roi_business_out Patient_Group '+ProjectName+'working/', function (error, stdout, stderr) {
   if (error) {
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });

 rb.on('exit', function (code) {
   console.log('Child process exited with exit code '+code);
 });

};

function child_GetXformFiles(data)
{
    console.log('INSIDE GETXFORMFILES '+data);
    if(data.group === 'patient')
    {
        gxf = childProcess.exec(CoreLibsPath+'/get_xform_files.sh '+ProjectName+data.path+' '+data.group+' '+ProjectName+' '+CoreLibsPath, function(error, stdout, stderr) {
        if(error){
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       console.log('Child Process STDOUT: '+stdout);
       console.log('Child Process STDERR: '+stderr);
     });
    }
    else
    {
        gxf = childProcess.exec(CoreLibsPath+'/get_xform_files.sh '+ProjectName+data.path+' '+data.group+' '+ProjectName+' '+CoreLibsPath, function(error, stdout, stderr) {
        if(error){
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       console.log('Child Process STDOUT: '+stdout);
       console.log('Child Process STDERR: '+stderr);
     });
    }
    
  gxf.on('exit', function (code) {
   console.log('Child process create template exited with exit code '+code);
 });
};

function child_RegAndCombine(data)
{
  // raw path ->  /stbb_home/jenkinsjc/Desktop/new_tortoiseDti/Tortoise-Web-Services/Server/Projects/dti_data/    
    console.log('INSIDE REGANDCOMBINE '+data);
    rag = childProcess.exec(CoreLibsPath+'/reg_and_combine.sh '+ProjectName+data.working_path+' '+data.label_src+' '+data.label_tgt+' '+ProjectName+data.base_path+' '+CoreLibsPath, function(error, stdout, stderr) {
    if(error){
     console.log(error.stack);
     console.log('Error code: '+error.code);
     console.log('Signal received: '+error.signal);
   }
   console.log('Child Process STDOUT: '+stdout);
   console.log('Child Process STDERR: '+stderr);
 });
  rag.on('exit', function (code) {
   console.log('Child process create template exited with exit code '+code);
 });

};

function child_createProject(data)
{
    console.log('INSIDE createProject '+data);
    if(data.folderArgs){
        cp = childProcess.exec('./create_project.sh '+data.project_name+ ' '+data.folderArgs, function(error, stdout, stderr) {        
        if(error){
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       console.log('Child Process STDOUT: '+stdout);
       console.log('Child Process STDERR: '+stderr);
     });
      cp.on('exit', function (code) {
       console.log('Child process create template exited with exit code '+code);
     });
    }
    else{
        cp = childProcess.exec('./create_project.sh '+data.project_name, function(error, stdout, stderr) {        
        if(error){
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       console.log('Child Process STDOUT: '+stdout);
       console.log('Child Process STDERR: '+stderr);
     });
      cp.on('exit', function (code) {
       console.log('Child process create template exited with exit code '+code);
     });
 }
};

io.sockets.on('connection', function(socket){
  
  var initial = true;
  var watch;    
  
  console.log('connection started');
  socket.emit('success', 'Server heard your request.');
  

  console.log("Project path = ",ProjectPath);
  console.log("CORE LIBS PATH = ",project.getCoreDirName());
  
  socket.on('disconnect', function(){
    console.log('finishing watch');
    console.log(watch);
    if(typeof watch != 'undefined')
    {
        watch.kill();
    }
  });
  
  
  socket.on('plumbjs', function(data){
    console.log("We ask you... so you want to plumb?");
    console.log("You said -> "+data.txt);
  });
  
  
  socket.on('atlas', function(data){
    console.log(data.txt+" IN MY ATLAS");
  });
  
  socket.on('new_project', function(data){    
    var cre8Path = ProjectPath + '/Projects/' + data.project_name + '/';
    console.log('project path = '+cre8Path);
    ProjectName  = cre8Path;
    console.log('user email   = '+data.user_email);
    child_createProject(data);
  });
  
  socket.on('combine_xform', function(data){  
    child_CombineTransformations(data);  
  });
  
  socket.on('apply_ttt_xform', function(data){    
    child_ApplyTransformationToTensor(data);    
  });
  
  socket.on('create_template', function(data){
  // uncomment below when ready to test the whole thing
    child_CreateTemplate(data);    
  });
  
  socket.on('reg_and_combine', function(data){
    console.log('reg and combine step');
    child_RegAndCombine(data);
  });
  
  socket.on('read_list_file', function(data){
  
    console.log('reading list file...');
    var c = data.cat;
    
    TortoiseProxy.child_readFile(data.path, data.cat, 
      function(datat)
      {      
        current_category = c;
        switch(current_category)
        {
            case 'control' :
                control_subjects = [];
                control_subjects = datat.split('\n');
                break;
            case 'patient' :
                patient_subjects = [];
                patient_subjects = datat.split('\n');
                break;
            case 'atlas'   :
                atlas_subjects = [];
                atlas_subjects = datat.split('\n');
                break;
            case 'csv'     :
                
                break;
            default        :
                console.log('unknown category.');
        }
        
        var x = TortoiseProxy.getSubjectDataByGroup(data.id);
        if(!x)
        {
            TortoiseProxy.addSubjectData({id: data.id, data: datat.split('\n')});
            console.log('data added');
            console.log('printing subjects by id: ',data.id,' -> ',TortoiseProxy.getSubjectDataByGroup(data.id));
        }
        else
        {
            TortoiseProxy.setSubjectData({id: data.id, data: datat.split('\n')});
        }
        
      }
    );
  });
  
  socket.on('monitor_progress', function(data){
     console.log('prior to scrapage!!!!!!!!!!!!!!!');
     child_scrape(data, socket, function(cbData){
     
        console.log('DONE');
        console.log(cbData);
        
     });
     console.log('returned from scrapage!!!!!!!!!!!!!!!!!!');
  
  });
  
  socket.on('scene_graph', function(data){
        console.log('in server...');
        console.log("Action in SG = ", data.txt);
        if(data.txt == "initialize")
        {
            scene_graph_init(data,socket);
        }
        if(data.txt == "update")
        {
            scene_graph_update(data);
        }
        if(data.txt == "execute")
        {
            scene_graph_execute(data);
        }        
  });   

  socket.on('get_csv_file', function(data){
     child_readCSVFile(data,socket);
  });

  socket.on('request', function(requestData){
    console.log('data recieved');
    console.log('process about to start');
    watch = child.spawn('octave', ['-i', '-q', '--verbose']);
    watch.stdin.setEncoding = 'utf-8';
    console.log('process started');

     watch.stdout.on('data', function(data){
      console.log('stdout  data - ' + data.toString());
      var parsed = data.toString().replace(/(octave:)[0-9]+>/, '');
        console.log('size of parsed: ',parsed.length);
      if(parsed.length == 2){
        parsed = data.toString().replace(/error: product: /, '');
        return;
      }
      console.log('parsed data ' + parsed);
      console.log('data length ' + parsed.trim().length);
      if(parsed.trim().length > 0)
          socket.emit('response',{message: parsed});
     });
  
    watch.stderr.on('data', function(data){
      console.log('error occurred ' + data.toString());
      socket.emit('response',data.toString())
        });

    watch.on('exit', function(code){
      console.log('process exited with code ' + code);
        });

    watch.stdin.write(requestData.message);    
    watch.stdin.end();

    //ss(socket).emit('response', watch.stdout);

  });
  
  socket.on('plot', function(data) {
    var d1 = []; var d2 = [];  var pairs = [];
    for(var idx in data.message.x){ d1.push(data.message.x[idx]);   }
    for(var idx in data.message.y){ d2.push(data.message.y[idx]);   }
    for(var idx in data.message.x){ pairs.push([d1[idx], d2[idx]]); }
    socket.emit('plot_data', pairs);
  });
  
  socket.on('image', function(data) {
    socket.emit('image_data', data);
  });
  
  socket.on('clear', function(data){
    socket.emit('clear_data', data);
  });
  
  socket.on('populate_list', function(data){
    console.log(data);
    
    switch(current_category)
    {
        case 'control' :
             console.log('populate my list', control_subjects);
            socket.emit('populate_the_list', control_subjects);
            break;
        case 'patient' :
             console.log('populate my list', patient_subjects);
            socket.emit('populate_the_list', patient_subjects);
            break;
        case 'atlas' :
             console.log('populate my list', atlas_subjects);
            socket.emit('populate_the_list', atlas_subjects);
            break;
        default :
            console.log('you ain\'t populatin\' anything varmint');
    }   
  });
  
  socket.on('roi_business', function(data){
    console.log('roi business commencing');
    child_ROIBusiness(data);
  });
  
  
});
