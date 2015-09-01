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
     csv,
     comb_trans;
     
     
    var current_category = null;
    
    var subject_data = [];
    
    
    var patient_subjects = [];
    var control_subjects = [];
    var atlas_subjects = [];
    var project = require('./ProjectProxy.js').ProjectProxy;
    var CoreLibsPath = project.getCoreDirName();
    
    var ProjectPath  = project.getDirName(); // Server/Projects
    var ProjectName = ProjectPath+'/Projects/hellos';//  = project.getProjectName();    
    
    var ScraperProxy = require('./ScraperProxy.js').ScraperProxy;
    var SceneGraphProxy = require('./SceneGraphProxy.js').SceneGraphProxy;
    
    
var TortoiseProxy =
{    
    getAllSubjectData : function()
    {
        return this.subject_data;
    },
    getSubjectDataByGroup : function(group)
    {
        var x = this.getAllSubjectData();
        if(!x){console.log('group does not exist');return null};
        for(var i = 0; i < x.length; i++)
        {
            if(x[i].id == group)
            {
                return x[i].data;
            }
        }
    },     
    setSubjectData : function(data)
    {
        this.subject_data = data;
    },
    addSubjectData : function(subs)
    {
        var x = this.getAllSubjectData();
        if(!x) x = [];
        x.push( { id: subs.id, data: subs.data} );
        this.setSubjectData(x);    
    },
    child_ls: function(dir,callback)
    {
     ls = childProcess.exec('ls -lsa '+dir, function (error, stdout, stderr) {
       if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       console.log('Child Process STDOUT: '+stdout);
       console.log('Child Process STDERR: '+stderr);
       if(callback) {
        callback(stdout);
       }
     });
     ls.on('exit', function (code) {
       console.log('Child process exited with exit code '+code);
     }); 
    }, 


  // working, follow pattern for callback in other TortoiseProxy methods
    child_readFile : function(file, category, callback)
    {
      rf = childProcess.exec('cat '+ProjectName+'/'+file, function (error, stdout, stderr) {
       if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       console.log('Child Process STDOUT: '+stdout);
       console.log('Child Process STDERR: '+stderr);
       // IMPORTANT!  the callback is used for async return handling within the scope of another function (ie - server.js)
       callback(stdout);        
     });

     rf.on('exit', function (code) {
       console.log('Child process exited with exit code '+code);
     });
    },

    child_readCSVFile : function(data,socket)
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
    },
    child_CombineTransformations : function(data)
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
    },

    child_ApplyTransformationToTensor : function(data)
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
    },

    child_CreateTemplate : function(data)
    {
        console.log('Creating Template...');
        console.log(data);
        console.log(ProjectName+data.path);
        // the 'y' is for yes!
        //  this fixes image mismatch due to mipav dropping a slice
        create_template = childProcess.exec('cd '+ data.exec_path+' && /raid1b/STBBapps/DTIREG/bin/dtireg_create_template_jeff '+ProjectName+data.path+' '+data.step+' '+data.exec_path+' < '+ProjectName+"/answer_yes.txt", function(error, stdout, stderr) {
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
         
    },
    
    child_ROIBusiness : function(data)
    {
       rb = childProcess.exec(CoreLibsPath+'/roi_business.sh '+data.derived_values + ' '+ProjectName+'working_atlas/roi_list.txt '+ ProjectName+'working_atlas/roi_business_out patients '+ProjectName+'working/', function (error, stdout, stderr) {
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

    },

    child_GetXformFiles : function(data)
    {
        console.log('INSIDE GETXFORMFILES '+data);

            gxf = childProcess.exec(CoreLibsPath+'/get_xform_files.sh '+ProjectName+data.path+' '+data.group+' '+ProjectName+' '+CoreLibsPath, function(error, stdout, stderr) {
            if(error){
             console.log(error.stack);
             console.log('Error code: '+error.code);
             console.log('Signal received: '+error.signal);
           }
           console.log('Child Process STDOUT: '+stdout);
           console.log('Child Process STDERR: '+stderr);
         });

        
      gxf.on('exit', function (code) {
       console.log('Child process create template exited with exit code '+code);
     });
    },

    child_RegAndCombine : function(data)
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

    },


    child_createProject : function(data)
    {
        console.log('INSIDE createProject '+data);
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

    },
};

module.exports.TortoiseProxy = TortoiseProxy;
